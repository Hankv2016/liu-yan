// GET    /api/posts/:slug — 获取单篇文章
// PUT    /api/posts/:slug — 更新文章（需认证）
// DELETE /api/posts/:slug — 删除文章（需认证）

export async function onRequest(context) {
  const { request, env, params } = context;
  const { slug } = params;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  // —— GET：获取单篇文章 ——
  if (request.method === "GET") {
    try {
      const raw = await env.BLOG_KV.get(`posts:${slug}`);
      if (!raw) {
        return new Response(JSON.stringify({ error: "Post not found" }), {
          status: 404,
          headers,
        });
      }
      return new Response(raw, { headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Failed to load post" }), {
        status: 500,
        headers,
      });
    }
  }

  // —— PUT / DELETE：需要认证 ——
  const auth = request.headers.get("Authorization") || "";
  const token = auth.replace("Bearer ", "");
  if (token !== env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers,
    });
  }

  // —— PUT：更新文章 ——
  if (request.method === "PUT") {
    try {
      const body = await request.json();
      const { title, content, excerpt, category, tags } = body;

      if (!title || !content) {
        return new Response(JSON.stringify({ error: "title and content are required" }), {
          status: 400,
          headers,
        });
      }

      const existingRaw = await env.BLOG_KV.get(`posts:${slug}`);
      const existing = existingRaw ? JSON.parse(existingRaw) : {};

      const post = {
        ...existing,
        slug,
        title,
        content,
        excerpt: excerpt || content.replace(/<[^>]*>/g, "").substring(0, 150) + "...",
        category: category || existing.category || "Uncategorized",
        tags: tags || existing.tags || [],
        updated_at: new Date().toISOString(),
      };

      await env.BLOG_KV.put(`posts:${slug}`, JSON.stringify(post));

      // 更新列表中的摘要
      const listRaw = await env.BLOG_KV.get("posts:list");
      const list = listRaw ? JSON.parse(listRaw) : [];
      const idx = list.findIndex((p) => p.slug === slug);
      const summary = {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        tags: post.tags,
        created_at: post.created_at,
      };
      if (idx >= 0) {
        list[idx] = summary;
      } else {
        list.push(summary);
      }
      await env.BLOG_KV.put("posts:list", JSON.stringify(list));

      return new Response(JSON.stringify({ ok: true, post }), { headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers,
      });
    }
  }

  // —— DELETE：删除文章 ——
  if (request.method === "DELETE") {
    await env.BLOG_KV.delete(`posts:${slug}`);

    // 从列表中移除
    const listRaw = await env.BLOG_KV.get("posts:list");
    if (listRaw) {
      const list = JSON.parse(listRaw).filter((p) => p.slug !== slug);
      await env.BLOG_KV.put("posts:list", JSON.stringify(list));
    }

    return new Response(JSON.stringify({ ok: true }), { headers });
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers,
  });
}
