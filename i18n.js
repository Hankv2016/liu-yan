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
      welcome: "Welcome to Hankv Blog",
      welcome_sub: "Write code, write life.",
      about_me: "About Me",
      about_me_text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
      latest_posts: "Latest Posts",
      no_posts: "No posts yet.",
      no_results: "No matching posts found.",
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
      logout: "Logout",
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
      comments_title: "Comments",
      comment_name_ph: "Your name",
      comment_content_ph: "Write a comment...",
      comment_submit: "Submit",
      no_comments: "No comments yet. Be the first!",
      load_comments_failed: "Failed to load comments.",
      need_name: "Please enter your name",
      need_comment: "Please write a comment",
      comment_success: "Comment submitted!",
      comment_failed: "Failed to submit",
      admin_need_server: "Please open this page via a local server or after deploy (e.g. npx wrangler dev / npx serve .). Double-clicking the file won't work.",
      no_tags_hint: "No existing tags yet — publish a post with tags first.",
      manage_comments: "Manage Comments",
      manage_posts: "Manage Posts",
      select_post: "Select a post:",
      delete_comment_confirm: "Delete this comment? This cannot be undone.",
      write_post: "Write Post",
      view_post: "View",
      dashboard_welcome: "Admin Dashboard",
      dashboard_sub: "Manage your blog content here.",
      manage_posts_desc: "Edit, publish and delete your posts.",
      write_post_desc: "Create a new article.",
      logout_desc: "Sign out of the admin panel.",
      save_draft: "Save Draft",
      draft_saved: "Draft saved",
      restore_draft: "Restore unsaved draft?",
      draft_save_failed: "Failed to save draft",
      manage_comments_desc: "Review and delete reader comments.",
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
      welcome: "欢迎来到 Hankv 博客",
      welcome_sub: "写代码，写生活。",
      about_me: "关于我",
      about_me_text: "这是一段关于我的介绍文字，可以在此处修改。",
      latest_posts: "最新文章",
      no_posts: "还没有文章。",
      no_results: "没有匹配的文章。",
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
      logout: "退出",
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
      comments_title: "评论",
      comment_name_ph: "你的昵称",
      comment_content_ph: "写评论...",
      comment_submit: "提交",
      no_comments: "暂无评论，来说两句吧！",
      load_comments_failed: "加载评论失败。",
      need_name: "请输入昵称",
      need_comment: "请输入评论内容",
      comment_success: "评论已提交！",
      comment_failed: "提交失败",
      admin_need_server: "请通过本地服务器或部署后访问本页（例如 npx wrangler dev 或 npx serve .）。直接双击打开文件无法使用登录、文章列表和标签联想。",
      no_tags_hint: "还没有已有标签，请先发布一篇带标签的文章。",
      manage_comments: "管理评论",
      manage_posts: "管理文章",
      select_post: "选择文章：",
      delete_comment_confirm: "确定删除这条评论吗？此操作不可撤销。",
      write_post: "写文章",
      view_post: "查看",
      dashboard_welcome: "管理控制台",
      dashboard_sub: "在这里管理你的博客内容。",
      manage_posts_desc: "编辑、发布与删除文章。",
      write_post_desc: "撰写一篇新文章。",
      logout_desc: "退出管理员登录。",
      save_draft: "保存草稿",
      draft_saved: "草稿已保存",
      restore_draft: "检测到未发布的草稿，是否恢复？",
      draft_save_failed: "草稿保存失败",
      manage_comments_desc: "查看并删除读者评论。",
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
