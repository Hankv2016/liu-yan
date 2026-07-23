// GET  /api/comments/:slug  — 获取评论列表
// POST /api/comments/:slug  — 发表新评论

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const slug = url.pathname.split("/api/comments/")[1];

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  // —— GET：获取评论 ——
  if (request.method === "GET") {
    try {
      const raw = await env.BLOG_KV.get(`comments:${slug}`);
      const comments = raw ? JSON.parse(raw) : [];
      // 按时间正序（最早的在前）
      return new Response(JSON.stringify(comments), { headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Failed to load comments" }), { status: 500, headers });
    }
  }

  // —— POST：发表评论 ——
  if (request.method === "POST") {
    try {
      const body = await request.json();
      const { author, content } = body;

      if (!author || !author.trim()) {
        return new Response(JSON.stringify({ error: "Author name is required" }), { status: 400, headers });
      }
      if (!content || !content.trim()) {
        return new Response(JSON.stringify({ error: "Comment content is required" }), { status: 400, headers });
      }
      if (author.trim().length > 50) {
        return new Response(JSON.stringify({ error: "Author name too long" }), { status: 400, headers });
      }
      if (content.trim().length > 5000) {
        return new Response(JSON.stringify({ error: "Comment too long" }), { status: 400, headers });
      }

      const now = new Date().toISOString();
      const comment = {
        id: crypto.randomUUID(),
        author: author.trim(),
        content: content.trim(),
        created_at: now,
      };

      const raw = await env.BLOG_KV.get(`comments:${slug}`);
      const comments = raw ? JSON.parse(raw) : [];
      comments.push(comment);
      await env.BLOG_KV.put(`comments:${slug}`, JSON.stringify(comments));

      return new Response(JSON.stringify({ ok: true, comment }), { status: 201, headers });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid request" }), { status: 400, headers });
    }
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
}
