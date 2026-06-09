(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function setupMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var panel = document.querySelector('.mobile-panel');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var current = 0;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        show(current + 1);
      }, 5200);
    }
  }

  function setupFilters() {
    var grid = document.getElementById('searchGrid');
    if (!grid) {
      return;
    }
    var input = document.getElementById('searchInput');
    var yearFilter = document.getElementById('yearFilter');
    var typeFilter = document.getElementById('typeFilter');
    var genreFilter = document.getElementById('genreFilter');
    var reset = document.getElementById('resetFilter');
    var empty = document.getElementById('emptyResult');
    var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-card]'));
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';

    if (input && query) {
      input.value = query;
    }

    function contains(haystack, needle) {
      return String(haystack || '').toLowerCase().indexOf(String(needle || '').toLowerCase()) !== -1;
    }

    function apply() {
      var q = input ? input.value.trim() : '';
      var year = yearFilter ? yearFilter.value : '';
      var type = typeFilter ? typeFilter.value : '';
      var genre = genreFilter ? genreFilter.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var search = card.getAttribute('data-search') || '';
        var cardYear = card.getAttribute('data-year') || '';
        var cardType = card.getAttribute('data-type') || '';
        var cardGenre = card.getAttribute('data-genre') || '';
        var matched = true;

        if (q && !contains(search, q)) {
          matched = false;
        }
        if (year && cardYear !== year) {
          matched = false;
        }
        if (type && !contains(cardType, type)) {
          matched = false;
        }
        if (genre && !contains(cardGenre, genre)) {
          matched = false;
        }

        card.style.display = matched ? '' : 'none';
        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    [input, yearFilter, typeFilter, genreFilter].forEach(function (element) {
      if (!element) {
        return;
      }
      element.addEventListener('input', apply);
      element.addEventListener('change', apply);
    });

    if (reset) {
      reset.addEventListener('click', function () {
        if (input) {
          input.value = '';
        }
        if (yearFilter) {
          yearFilter.value = '';
        }
        if (typeFilter) {
          typeFilter.value = '';
        }
        if (genreFilter) {
          genreFilter.value = '';
        }
        apply();
      });
    }

    apply();
  }

  function setupPlayers() {
    var shells = Array.prototype.slice.call(document.querySelectorAll('.player-shell'));
    shells.forEach(function (shell) {
      var video = shell.querySelector('video');
      var cover = shell.querySelector('.player-cover');
      var message = shell.querySelector('.player-message');
      var source = shell.getAttribute('data-video');
      var prepared = false;
      var hlsInstance = null;

      if (!video || !cover || !source) {
        return;
      }

      function showMessage(text) {
        if (!message) {
          return;
        }
        message.textContent = text;
        message.classList.add('is-visible');
        window.setTimeout(function () {
          message.classList.remove('is-visible');
        }, 3200);
      }

      function prepare() {
        if (prepared) {
          return;
        }
        prepared = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: false
          });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
            if (!data || !data.fatal) {
              return;
            }
            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
              hlsInstance.startLoad();
            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
              hlsInstance.recoverMediaError();
            } else {
              showMessage('播放失败，请稍后重试');
            }
          });
          return;
        }

        video.src = source;
      }

      function start() {
        prepare();
        video.controls = true;
        cover.classList.add('is-hidden');
        var playResult = video.play();
        if (playResult && typeof playResult.catch === 'function') {
          playResult.catch(function () {
            cover.classList.remove('is-hidden');
            showMessage('点击播放按钮继续观看');
          });
        }
      }

      cover.addEventListener('click', start);
      video.addEventListener('play', function () {
        cover.classList.add('is-hidden');
      });
      video.addEventListener('error', function () {
        showMessage('播放失败，请稍后重试');
      });
      window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    });
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
    setupPlayers();
  });
})();
