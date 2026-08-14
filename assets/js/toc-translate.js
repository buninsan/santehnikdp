// Translates the "Table of Contents" heading that Publii's editor
// (TinyMCE "mcetoc" plugin) inserts as literal, English-only HTML
// directly into a post/page's own stored content -- not something the
// theme templates control, so it can't be fixed per-article without
// hand-editing every post. Runs on every post/page instead, once, so
// it covers all existing and future articles automatically.
(function () {
    var container = document.querySelector('.post__toc');
    if (!container) return;

    var heading = container.querySelector('h1, h2, h3, h4, p, span');
    if (!heading || heading.textContent.trim() !== 'Table of Contents') return;

    // <html lang="..."> is already set correctly per page by head.hbs.
    heading.textContent = document.documentElement.lang === 'ru' ? 'Содержание' : 'Зміст';
})();
