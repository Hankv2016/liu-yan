// SSR for /post (and /post.html) — 服务端读 KV 把文章正文注入初始 HTML
// 目的：让 Edge 阅读模式 / 搜索引擎爬虫在初始 HTML 中即拿到完整语义化正文，
// 不再依赖客户端 fetch 异步注入（阅读模式抓不到异步内容）。
//
// 路由说明：Cloudflare Pages 默认把 /post.html 301 到 /post，故本函数绑定 /post。
// 模板来源：env.ASSETS.fetch("/post") 直接读取静态资源桶里的 post.html 内容
//           （ASSETS 不经过 Functions 路由，不会自引用死循环）。

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");

  // 取静态 post.html 作为模板（ASSETS 层解析 /post -> post.html 内容，200 不重定向）
  let html;
  try {
    const assetResp = await env.ASSETS.fetch(new URL("/post", url.origin));
    html = await assetResp.text();
  } catch (e) {
    // 拿不到模板则彻底降级：交给静态资源处理
    return env.ASSETS.fetch(request);
  }

  // 无 slug：注入文章列表，展示所有文章而非错误
  if (!slug) {
    html = html.replace(MAIN_BLOCK_RE, await renderListHtml(env));
    html = html.replace("<title>Post — Hankv Blog</title>", "<title>Posts — Hankv Blog</title>");
    return htmlResponse(html);
  }

  // 读 KV
  let post = null;
  try {
    const raw = await env.BLOG_KV.get(`posts:${slug}`);
    if (raw) post = JSON.parse(raw);
  } catch (e) {
    post = null;
  }

  // 文章不存在：注入文章列表，展示所有文章而非错误
  if (!post) {
    html = html.replace(MAIN_BLOCK_RE, await renderListHtml(env));
    html = html.replace("<title>Post — Hankv Blog</title>", "<title>Posts — Hankv Blog</title>");
    return htmlResponse(html);
  }

  // ——渲染正文——
  const bodyHtml = await renderBody(post);
  const title = post.title || "";
  const desc = post.excerpt || post.title || "";
  const category = post.category || "";
  const createdAt = post.created_at || "";

  let tagsHtml = "";
  if (Array.isArray(post.tags) && post.tags.length) {
    tagsHtml =
      '<div style="margin-top:12px;display:flex;gap:6px;flex-wrap:wrap">' +
      post.tags.map((t) => '<span class="tag">' + esc(t) + "</span>").join("") +
      "</div>";
  }

  const articleHtml =
    '<main id="postContainer">\n' +
    '    <article id="postArticle" itemscope itemtype="https://schema.org/Article" data-ssr="1">\n' +
    '      <div class="post-header">' +
    '<h1 itemprop="headline">' + esc(title) + "</h1>" +
    '<div class="meta">' +
    '<time itemprop="datePublished" datetime="' + esc(createdAt) + '">' + formatDate(createdAt) + "</time>" +
    '<span itemprop="articleSection">' + esc(category) + "</span>" +
    "</div>" +
    tagsHtml +
    "</div>" +
    '<div class="post-body" itemprop="articleBody">' + bodyHtml + "</div>\n" +
    "    </article>\n" +
    "  </main>";

  // JSON-LD 结构化数据
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    datePublished: createdAt,
    dateModified: post.updated_at || createdAt,
    articleSection: category,
    keywords: (post.tags || []).join(", "),
    description: post.excerpt || "",
    mainEntityOfPage: url.href,
  };
  const jsonLdTag =
    '<script type="application/ld+json" id="articleJsonLd">' +
    JSON.stringify(jsonLd).replace(/</g, "\\u003c") +
    "</scr" + "ipt>\n";

  // ——注入模板——
  html = html
    .replace(
      "<title>Post — Hankv Blog</title>",
      "<title>" + esc(title) + " — Hankv Blog</title>"
    )
    .replace(
      '<meta name="description" content="" />',
      '<meta name="description" content="' + esc(desc) + '" />'
    )
    .replace(
      '<meta property="og:title" content="" />',
      '<meta property="og:title" content="' + esc(title) + '" />'
    )
    .replace(
      '<meta property="og:url" content="" />',
      '<meta property="og:url" content="' + esc(url.href) + '" />'
    )
    .replace(
      '<meta property="og:description" content="" />',
      '<meta property="og:description" content="' + esc(desc) + '" />'
    )
    .replace("</head>", jsonLdTag + "</head>")
    .replace(MAIN_BLOCK_RE, articleHtml);

  return htmlResponse(html);
}

// 匹配模板里 <main id="postContainer" ...> ... </main> 整块，用 SSR 内容替换
const MAIN_BLOCK_RE = /<main id="postContainer"[\s\S]*?<\/main>/;

async function renderBody(post) {
  const contentType = post.content_type || "html";
  const content = post.content || "";
  if (contentType === "markdown") {
    try {
      const mod = await import("marked");
      const marked = mod.marked || mod.default;
      marked.setOptions({ breaks: true, gfm: true });
      return marked.parse(content);
    } catch (e) {
      // 无 marked 依赖时降级：转义并按段落输出，保证阅读模式仍有正文
      return content
        .split(/\n{2,}/)
        .map((p) => "<p>" + esc(p).replace(/\n/g, "<br>") + "</p>")
        .join("");
    }
  }
  // HTML 文章直出（后台可信内容）
  return content;
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return esc(iso || "");
    return d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日";
  } catch (e) {
    return "";
  }
}

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function htmlResponse(html) {
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}

// 渲染文章列表（文章不存在 / 无 slug 时作为 fallback 页面）
async function renderListHtml(env) {
  let posts = [];
  try {
    const raw = await env.BLOG_KV.get("posts:list");
    if (raw) posts = JSON.parse(raw);
  } catch (e) {}
  posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const items = posts.map(function(p) {
    const date = formatDate(p.created_at);
    const meta = [p.category, date].filter(Boolean).join(" · ");
    const excerpt = p.excerpt ? '<span class="pli-excerpt">' + esc(p.excerpt) + '</span>' : '';
    return '<li class="post-list-item"><a href="/post.html?slug=' + encodeURIComponent(p.slug) + '">' +
      '<span class="pli-title">' + esc(p.title) + '</span>' +
      (meta ? '<span class="pli-meta">' + esc(meta) + '</span>' : '') +
      excerpt + '</a></li>';
  }).join("");

  const body = posts.length
    ? '<ul class="post-list">' + items + '</ul>'
    : '<p class="no-posts" data-i18n="no_posts">No posts yet.</p>';

  return '<main id="postContainer" class="post-list-container" data-list="1">' +
    '<h1 class="post-list-title" data-i18n="all_posts">All Posts</h1>' +
    body + '</main>';
}
