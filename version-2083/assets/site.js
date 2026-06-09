(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function normalize(value) {
    return (value || '').toString().toLowerCase().trim();
  }

  function bindMenu() {
    var button = qs('[data-menu-toggle]');
    var panel = qs('[data-mobile-panel]');
    if (!button || !panel) {
      return;
    }
    button.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  function bindSearchForms() {
    qsa('[data-site-search-form]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = qs('input[name="q"]', form);
        var query = input ? input.value.trim() : '';
        var prefix = form.getAttribute('data-search-prefix') || './';
        var target = prefix + 'search.html';
        if (query) {
          target += '?q=' + encodeURIComponent(query);
        }
        window.location.href = target;
      });
    });
  }

  function bindHero() {
    var hero = qs('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = qsa('[data-hero-slide]', hero);
    var dots = qsa('[data-hero-dot]', hero);
    var prev = qs('[data-hero-prev]', hero);
    var next = qs('[data-hero-next]', hero);
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function restart() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }
    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
        restart();
      });
    });
    show(0);
    restart();
  }

  function bindFilters() {
    var panel = qs('[data-filter-panel]');
    var list = qs('[data-filter-list]');
    if (!panel || !list) {
      return;
    }
    var cards = qsa('[data-card]', list);
    var keyword = qs('[data-filter-keyword]', panel);
    var genre = qs('[data-filter-genre]', panel);
    var region = qs('[data-filter-region]', panel);
    var year = qs('[data-filter-year]', panel);
    var empty = qs('[data-empty-state]');

    function apply() {
      var q = normalize(keyword && keyword.value);
      var g = normalize(genre && genre.value);
      var r = normalize(region && region.value);
      var y = normalize(year && year.value);
      var shown = 0;
      cards.forEach(function (card) {
        var haystack = normalize(card.getAttribute('data-search'));
        var match = true;
        if (q && haystack.indexOf(q) === -1) {
          match = false;
        }
        if (g && normalize(card.getAttribute('data-genre')).indexOf(g) === -1) {
          match = false;
        }
        if (r && normalize(card.getAttribute('data-region')) !== r) {
          match = false;
        }
        if (y && normalize(card.getAttribute('data-year')) !== y) {
          match = false;
        }
        card.style.display = match ? '' : 'none';
        if (match) {
          shown += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('is-visible', shown === 0);
      }
    }

    [keyword, genre, region, year].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });

    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q');
    if (initial && keyword) {
      keyword.value = initial;
    }
    apply();
  }

  document.addEventListener('DOMContentLoaded', function () {
    bindMenu();
    bindSearchForms();
    bindHero();
    bindFilters();
  });
})();
