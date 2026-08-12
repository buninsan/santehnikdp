// Shared by the district-page block (mode="random", data-limit="10") and
// the "Усі відгуки" page template (mode="all"). Reads its own config off
// the container's data-* attributes so both can reuse the exact same
// fetch/render code instead of two half-duplicated copies.
(function () {
    var container = document.getElementById('reviews-list');
    if (!container) return;

    var mode = container.dataset.mode || 'all';
    var limit = Number(container.dataset.limit) || 0;
    var summaryEl = document.getElementById('reviews-summary');
    var moreEl = document.getElementById('reviews-more');

    function shuffle(arr) {
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }
        return arr;
    }

    function starString(rating) {
        return '★★★★★☆☆☆☆☆'.slice(5 - rating, 10 - rating);
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    fetch('https://santehnikdpvidguk.pages.dev/api/reviews')
        .then(function (r) { return r.json(); })
        .then(function (data) {
            if (!data.count) {
                if (summaryEl) summaryEl.textContent = 'Поки що немає відгуків.';
                return;
            }
            if (summaryEl) {
                summaryEl.textContent = data.average + ' ★ · ' + data.count + ' відгуків';
            }

            var shown = data.reviews;
            if (mode === 'random' && limit) {
                shown = shuffle(shown.slice()).slice(0, limit);
            }

            container.innerHTML = shown.map(function (r) {
                return '<article class="reviews__item">' +
                    '<div class="reviews__item-stars">' + starString(r.rating) + '</div>' +
                    '<p class="reviews__item-text">' + escapeHtml(r.text) + '</p>' +
                    '<p class="reviews__item-name">' + escapeHtml(r.name) + '</p>' +
                    '</article>';
            }).join('');

            if (moreEl && mode === 'random' && data.count <= limit) {
                moreEl.style.display = 'none';
            }

            var jsonldEl = document.getElementById('reviews-jsonld');
            if (jsonldEl) {
                jsonldEl.textContent = JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'LocalBusiness',
                    name: 'Сантехнік Дніпро',
                    aggregateRating: {
                        '@type': 'AggregateRating',
                        ratingValue: data.average,
                        reviewCount: data.count
                    },
                    review: data.reviews.slice(0, 20).map(function (r) {
                        return {
                            '@type': 'Review',
                            author: { '@type': 'Person', name: r.name },
                            reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
                            reviewBody: r.text
                        };
                    })
                });
            }
        });
})();
