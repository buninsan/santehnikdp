// Simple in-page lightbox for the portfolio photo grid (works-grid.hbs) —
// used both by the random block (works-list.hbs) and the full gallery
// page (page-our-works.hbs). Progressive enhancement: each <a> still
// points straight at the full image (opens in a new tab) as a no-JS
// fallback; when JS runs, clicks are intercepted and shown in an
// on-page overlay instead, with a close button, backdrop click, or
// Escape to dismiss. Reuses html.no-scroll — the same scroll-lock class
// the mobile menu drawer already uses (see main.css) — instead of a
// second one-off scroll-lock mechanism.
(function () {
    var links = document.querySelectorAll('.works__item a');
    if (!links.length) return;

    var overlay = null;
    var img = null;

    function build() {
        overlay = document.createElement('div');
        overlay.className = 'works-lightbox is-hidden';
        overlay.setAttribute('aria-hidden', 'true');

        var closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'works-lightbox__close';
        closeBtn.setAttribute('aria-label', 'Закрити');
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', close);

        img = document.createElement('img');
        img.className = 'works-lightbox__img';

        overlay.appendChild(closeBtn);
        overlay.appendChild(img);
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) close();
        });
        document.body.appendChild(overlay);
    }

    function open(href, alt) {
        if (!overlay) build();
        img.src = href;
        img.alt = alt || '';
        overlay.classList.remove('is-hidden');
        overlay.setAttribute('aria-hidden', 'false');
        document.documentElement.classList.add('no-scroll');
    }

    function close() {
        if (!overlay || overlay.classList.contains('is-hidden')) return;
        overlay.classList.add('is-hidden');
        overlay.setAttribute('aria-hidden', 'true');
        document.documentElement.classList.remove('no-scroll');
    }

    links.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var imgEl = link.querySelector('img');
            open(link.getAttribute('href'), imgEl ? imgEl.alt : '');
        });
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') close();
    });
})();
