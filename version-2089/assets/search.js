(function () {
  const index = window.MOVIE_SEARCH_INDEX || [];
  const input = document.querySelector('[data-search-input]');
  const results = document.querySelector('[data-search-results]');
  const summary = document.querySelector('[data-search-summary]');

  if (!input || !results || !summary) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q') || '';
  input.value = initialQuery;

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function card(item) {
    const tags = Array.isArray(item.tags) ? item.tags.slice(0, 3) : [];
    const tagHtml = [item.genre].concat(tags).filter(Boolean).slice(0, 4).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    return '<article class="movie-card">' +
      '<a class="poster-link" href="' + escapeHtml(item.url) + '">' +
      '<img src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
      '<span class="play-chip">立即播放</span>' +
      '</a>' +
      '<div class="movie-card-body">' +
      '<h3><a href="' + escapeHtml(item.url) + '">' + escapeHtml(item.title) + '</a></h3>' +
      '<p>' + escapeHtml(item.oneLine || '') + '</p>' +
      '<div class="meta-line"><span>' + escapeHtml(item.year) + '</span><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.category) + '</span></div>' +
      '<div class="tag-row">' + tagHtml + '</div>' +
      '</div>' +
      '</article>';
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function performSearch(query) {
    const keywords = normalize(query).split(/\s+/).filter(Boolean);

    if (keywords.length === 0) {
      const hot = index.slice(0, 24);
      results.innerHTML = hot.map(card).join('');
      summary.textContent = '已为你展示热门影片，可输入关键词继续搜索。';
      return;
    }

    const matched = index.filter(function (item) {
      const haystack = normalize([
        item.title,
        item.year,
        item.region,
        item.type,
        item.category,
        item.genre,
        Array.isArray(item.tags) ? item.tags.join(' ') : '',
        item.oneLine
      ].join(' '));

      return keywords.every(function (keyword) {
        return haystack.indexOf(keyword) !== -1;
      });
    }).slice(0, 96);

    results.innerHTML = matched.map(card).join('');
    summary.textContent = '搜索 “' + query + '” 找到 ' + matched.length + ' 个结果。';
  }

  performSearch(initialQuery);

  input.addEventListener('input', function () {
    performSearch(input.value);
  });
})();
