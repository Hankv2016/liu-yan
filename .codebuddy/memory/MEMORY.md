# Project Memory

## Hankv2016 Blog — Cloudflare Pages 博客系统

### 文件结构
- `index.html` — 首页（侧边栏 + Banner + About Me + 文章列表）
- `admin.html` — 后台管理（发文、编辑、删除文章），通过密码认证
- `post.html` — 单篇文章展示页，通过 `?slug=xxx` 访问
- `functions/api/posts.js` — API：文章列表 (GET) + 创建 (POST)
- `functions/api/posts/[slug].js` — API：单篇获取/更新/删除 (GET/PUT/DELETE)
- `wrangler.toml` — Cloudflare Pages 配置

### 技术架构
- 前端：纯 HTML/CSS/JS，浅色/深色双主题
- 后端：Cloudflare Pages Functions（serverless）
- 存储：Cloudflare KV（BLOG_KV namespace）
- 认证：Bearer Token（密码存储在 env.ADMIN_PASSWORD）

### 部署步骤
1. 在 Cloudflare Dashboard 创建 KV namespace
2. 在 Pages 项目中绑定 KV（名称 BLOG_KV）
3. 设置环境变量 ADMIN_PASSWORD
4. `npx wrangler pages deploy .`

### 搜索框样式
- 无圆角，宽度 100px，padding 小，font-size 0.85rem
