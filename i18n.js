(function() {
  const dict = {
    en: {
      search: "Search...",
      navigation: "Navigation",
      home: "Home",
      posts: "Posts",
      about: "About",
      categories: "Categories",
      tags: "Tags",
      links: "Links",
      social: "Social",
      welcome: "Welcome to Hankv2016 Blog",
      welcome_sub: "Write code, write life.",
      about_me: "About Me",
      about_me_text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
      latest_posts: "Latest Posts",
      no_posts: "No posts yet.",
      load_failed: "Failed to load posts.",
      local_server: "Please start a local server to load posts (e.g. npx serve .).",

      loading: "Loading...",
      no_post: "No post specified.",
      go_home: "Go home",
      post_not_found: "Post not found.",
      post_load_failed: "Failed to load post.",
      retry: "Retry",
      back_home: "← Back to Home",

      blog_admin: "Blog Admin",
      view_site: "View Site",
      admin_login: "Admin Login",
      admin_password: "Admin Password",
      login_btn: "Login",
      login_failed_prefix: "Login failed: ",
      wrong_password: "Wrong password",
      title_label: "Title",
      title_ph: "Article title",
      slug_label: "Slug",
      slug_ph: "url-friendly-name",
      category_label: "Category",
      category_ph: "Tech",
      tags_label: "Tags (comma)",
      tags_ph: "js, css",
      content_type_label: "Content Type",
      content_html: "HTML",
      content_markdown: "Markdown",
      content_ph_html: "Write your article in HTML...\n\n<p>Hello world</p>",
      content_ph_md: "Write your article in Markdown...\n\n# Hello world\n\nThis is **bold** text.",
      publish: "Publish",
      update_btn: "Update",
      preview: "Preview",
      new_draft: "New Draft",
      all_posts: "All Posts",
      edit: "Edit",
      delete: "Delete",
      delete_confirm: "Delete '{slug}'? This cannot be undone.",
      no_posts_yet: "No posts yet — write your first!",
      load_posts_failed: "Failed to load posts.",
      saved: "Saved!",
      need_title: "Please enter a title",
      need_content: "Please write some content",
      post_not_found_err: "Post not found",
      load_error: "Error loading post",
      delete_error: "Delete error",
      network_error: "Network error",
      unknown: "Unknown",
      error_prefix: "Error: ",
      untitled: "(Untitled)",
      no_content: "No content",
      lang_switch: "Language",
    },
    zh: {
      search: "搜索...",
      navigation: "导航",
      home: "首页",
      posts: "文章",
      about: "关于",
      categories: "分类",
      tags: "标签",
      links: "链接",
      social: "社交",
      welcome: "欢迎来到 Hankv2016 博客",
      welcome_sub: "写代码，写生活。",
      about_me: "关于我",
      about_me_text: "这是一段关于我的介绍文字，可以在此处修改。",
      latest_posts: "最新文章",
      no_posts: "还没有文章。",
      load_failed: "加载文章失败。",
      local_server: "请启动本地服务器以加载文章（例如 npx serve .）。",

      loading: "加载中...",
      no_post: "未指定文章。",
      go_home: "返回首页",
      post_not_found: "文章未找到。",
      post_load_failed: "加载文章失败。",
      retry: "重试",
      back_home: "← 返回首页",

      blog_admin: "博客管理",
      view_site: "查看网站",
      admin_login: "管理员登录",
      admin_password: "管理员密码",
      login_btn: "登录",
      login_failed_prefix: "登录失败：",
      wrong_password: "密码错误",
      title_label: "标题",
      title_ph: "文章标题",
      slug_label: "别名",
      slug_ph: "URL 友好名称",
      category_label: "分类",
      category_ph: "技术",
      tags_label: "标签（逗号分隔）",
      tags_ph: "js, css",
      content_type_label: "内容格式",
      content_html: "HTML",
      content_markdown: "Markdown",
      content_ph_html: "用 HTML 写文章...\n\n<p>Hello world</p>",
      content_ph_md: "用 Markdown 写文章...\n\n# Hello world\n\n这是 **加粗** 文字。",
      publish: "发布",
      update_btn: "更新",
      preview: "预览",
      new_draft: "新建草稿",
      all_posts: "所有文章",
      edit: "编辑",
      delete: "删除",
      delete_confirm: "确定要删除 '{slug}' 吗？此操作不可撤销。",
      no_posts_yet: "还没有文章 — 快写第一篇吧！",
      load_posts_failed: "加载文章失败。",
      saved: "已保存！",
      need_title: "请输入标题",
      need_content: "请输入内容",
      post_not_found_err: "文章未找到",
      load_error: "加载文章出错",
      delete_error: "删除出错",
      network_error: "网络错误",
      unknown: "未知错误",
      error_prefix: "错误：",
      untitled: "（无标题）",
      no_content: "无内容",
      lang_switch: "语言",
    }
  };

  window.getLang = function() { return localStorage.getItem('blog_lang') || 'en'; };
  window.setLang = function(lang) {
    localStorage.setItem('blog_lang', lang);
    var sel = document.getElementById('langSelect');
    if (sel) sel.value = lang;
    applyAllTranslations();
  };

  window.tt = function(key, reps) {
    var val = (dict[getLang()] && dict[getLang()][key]) || (dict.en && dict.en[key]) || key;
    if (reps) {
      Object.keys(reps).forEach(function(k) { val = val.split('{' + k + '}').join(reps[k]); });
    }
    return val;
  };

  function applyAllTranslations() {
    var lang = getLang();
    var d = dict[lang] || dict.en;
    // data-i18n → textContent
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      if (d[el.getAttribute('data-i18n')] !== undefined) {
        el.textContent = d[el.getAttribute('data-i18n')];
      }
    });
    // data-i18n-ph → placeholder
    document.querySelectorAll('[data-i18n-ph]').forEach(function(el) {
      if (d[el.getAttribute('data-i18n-ph')] !== undefined) {
        el.setAttribute('placeholder', d[el.getAttribute('data-i18n-ph')]);
      }
    });
    // data-i18n-title → title attribute
    document.querySelectorAll('[data-i18n-title]').forEach(function(el) {
      if (d[el.getAttribute('data-i18n-title')] !== undefined) {
        el.setAttribute('title', d[el.getAttribute('data-i18n-title')]);
      }
    });
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  }

  window.applyAllTranslations = applyAllTranslations;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      var sel = document.getElementById('langSelect');
      if (sel) sel.value = getLang();
      applyAllTranslations();
    });
  } else {
    var sel = document.getElementById('langSelect');
    if (sel) sel.value = getLang();
    applyAllTranslations();
  }
})();
