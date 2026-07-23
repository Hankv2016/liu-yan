// admin/common.js — 后台管理页面共享逻辑
// 依赖：需在本文件之前加载 /i18n.js（提供 setLang / tt / getLang / applyAllTranslations）

// 读取已保存的主题（后台独立持久化，不影响前台）
(function initTheme() {
  var saved = localStorage.getItem("admin_theme");
  if (saved) document.documentElement.setAttribute("data-theme", saved);
})();

// 主题切换（浅色/深色），状态写入 localStorage
function toggleTheme() {
  var r = document.documentElement;
  var next = r.getAttribute("data-theme") === "dark" ? "light" : "dark";
  r.setAttribute("data-theme", next);
  localStorage.setItem("admin_theme", next);
}

// 当前页面文件名（用于登录后跳回来源页）
function currentPageName() {
  return location.pathname.split("/").pop() || "posts.html";
}

// 检查登录态：未登录则跳转到登录页，并带上 redirect 参数
function requireAuth() {
  var token = localStorage.getItem("admin_token");
  if (!token) {
    location.href = "index.html?redirect=" + encodeURIComponent(currentPageName());
    return false;
  }
  return true;
}

// 带认证的请求头（从 localStorage 读取 token，避免变量不同步）
function authHeaders() {
  var token = localStorage.getItem("admin_token") || "";
  return { "Authorization": "Bearer " + token, "Content-Type": "application/json" };
}

// 退出登录
function logout() {
  localStorage.removeItem("admin_token");
  location.href = "index.html";
}

// 通用转义（防 XSS）
function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
