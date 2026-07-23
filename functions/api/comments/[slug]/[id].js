// DELETE /api/comments/:slug/:id  — 删除指定评论（需管理员认证）

export async function onRequest(context) {
  const { request, env, params } = context;
  const slug = params.slug;
  const id = params.id;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (request.method !== "DELETE") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
  }

  // —— 管理员认证 ——
  const auth = request.headers.get("Authorization") || "";
  const token = auth.replace("Bearer ", "");
  if (token !== env.ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers });
  }

  try {
    const raw = await env.BLOG_KV.get(`comments:${slug}`);
    let comments = raw ? JSON.parse(raw) : [];
    const before = comments.length;
    comments = comments.filter((c) => c.id !== id);
    if (comments.length === before) {
      return new Response(JSON.stringify({ error: "Comment not found" }), { status: 404, headers });
    }
    await env.BLOG_KV.put(`comments:${slug}`, JSON.stringify(comments));
    return new Response(JSON.stringify({ ok: true }), { headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to delete comment" }), { status: 500, headers });
  }
}
