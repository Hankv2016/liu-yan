// GET  /api/posts     — 获取文章列表
// POST /api/posts     — 创建新文章（需认证）

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // CORS headers
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  // —— GET：获取文章列表 ——
  if (request.method === "GET") {
    try {
      const raw = await env.BLOG_KV.get("posts:list");
      const posts = raw ? JSON.parse(raw) : [];
      // 按时间倒序
      posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return new Response(JSON.stringify(posts), { headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Failed to load posts" }), {
        status: 500,
        headers,
      });
    }
  }

  // —— POST：创建新文章（需要认证） ——
  if (request.method === "POST") {
    // 验证密码
    const auth = request.headers.get("Authorization") || "";
    const token = auth.replace("Bearer ", "");
    if (token !== env.ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers,
      });
    }

    try {
      const body = await request.json();
      const { title, content, excerpt, category, tags, slug } = body;

      if (!title || !content || !slug) {
        return new Response(JSON.stringify({ error: "title, content, slug are required" }), {
          status: 400,
          headers,
        });
      }

      const now = new Date().toISOString();
      const post = {
        slug,
        title,
        content,
        excerpt: excerpt || content.replace(/<[^>]*>/g, "").substring(0, 150) + "...",
        category: category || "Uncategorized",
        tags: tags || [],
        created_at: now,
        updated_at: now,
      };

      // 保存文章全文
      await env.BLOG_KV.put(`posts:${slug}`, JSON.stringify(post));

      // 更新文章列表
      const raw = await env.BLOG_KV.get("posts:list");
      const list = raw ? JSON.parse(raw) : [];
      // 摘要信息（不含正文）
      const summary = {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        tags: post.tags,
        created_at: post.created_at,
      };
      const existing = list.findIndex((p) => p.slug === slug);
      if (existing >= 0) {
        list[existing] = summary;
      } else {
        list.push(summary);
      }
      await env.BLOG_KV.put("posts:list", JSON.stringify(list));

      return new Response(JSON.stringify({ ok: true, post }), {
        status: 201,
        headers,
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers,
      });
    }
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers,
  });
}
