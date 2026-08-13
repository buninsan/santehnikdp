// Client-side random subset for the portfolio photo block (works-list.hbs,
// currently data-limit="2"). Mirrors reviews-list.js's random mode, but no
// fetch is needed here — the photos are already baked into this HTML at
// build time via Theme Settings upload fields, so this just shuffles and
// hides down to data-limit on every page load.
(function () {
    var container = document.getElementById('works-grid');
    if (!container || container.dataset.mode !== 'random') return;

    var limit = Number(container.dataset.limit) || 0;
    if (!limit) return;

    var items = Array.prototype.slice.call(container.querySelectorAll('.works__item'));
    if (items.length <= limit) return;

    for (var i = items.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = items[i];
        items[i] = items[j];
        items[j] = tmp;
    }

    items.forEach(function (item, index) {
        if (index >= limit) item.classList.add('is-hidden');
    });
})();
