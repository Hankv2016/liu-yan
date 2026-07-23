// GET /rss — 动态 RSS 2.0 Feed
// 从 KV 读取文章列表实时生成，增删文章自动同步（无需额外逻辑）。
// 仅包含文章的标题/链接/摘要/发布时间，绝不含评论。

export async function onRequest(context) {
  const { request, env } = context;

  try {
    // 动态获取域名 origin：线上指向 hankgame.cc.cd，本地开发指向 localhost
    const origin = new URL(request.url).origin;
    const siteTitle = env.SITE_TITLE || "Hankv Blog";

    const raw = await env.BLOG_KV.get("posts:list");
    const posts = raw ? JSON.parse(raw) : [];
    // 按发布时间倒序（最新在前）
    posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const items = posts.map(function (p) {
      const link = origin + "/post.html?slug=" + encodeURIComponent(p.slug);
      const pubDate = new Date(p.created_at).toUTCString();
      return [
        "    <item>",
        "      <title>" + xmlEscape(p.title || "") + "</title>",
        "      <link>" + link + "</link>",
        "      <guid isPermaLink=\"true\">" + link + "</guid>",
        "      <description>" + xmlEscape(p.excerpt || "") + "</description>",
        p.category ? "      <category>" + xmlEscape(p.category) + "</category>" : "",
        "      <pubDate>" + pubDate + "</pubDate>",
        "    </item>",
      ].filter(Boolean).join("\n");
    }).join("\n");

    const rss = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
      "  <channel>",
      "    <title>" + xmlEscape(siteTitle) + "</title>",
      "    <link>" + origin + "/</link>",
      '    <atom:link href="' + origin + '/rss" rel="self" type="application/rss+xml" />',
      "    <description>" + xmlEscape(siteTitle) + " — latest posts</description>",
      "    <language>zh-CN</language>",
      "    <lastBuildDate>" + new Date().toUTCString() + "</lastBuildDate>",
      "    <generator>Hankv Blog</generator>",
      items,
      "  </channel>",
      "</rss>",
    ].join("\n");

    return new Response(rss, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (err) {
    return new Response("Failed to generate RSS feed", { status: 500 });
  }
}

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
