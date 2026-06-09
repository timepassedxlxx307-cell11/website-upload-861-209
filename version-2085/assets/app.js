(function () {
  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>'"]/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
      }[char];
    });
  }

  function initMobileMenu() {
    var toggle = $(".mobile-toggle");
    var panel = $(".mobile-panel");
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener("click", function () {
      var open = panel.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      panel.setAttribute("aria-hidden", open ? "false" : "true");
      toggle.textContent = open ? "×" : "☰";
    });
  }

  function initHero() {
    var hero = $("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = $all(".hero-slide", hero);
    var dots = $all(".hero-dot", hero);
    if (slides.length < 2) {
      return;
    }
    var index = 0;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, position) {
        slide.classList.toggle("is-active", position === index);
      });
      dots.forEach(function (dot, position) {
        dot.classList.toggle("is-active", position === index);
      });
    }
    dots.forEach(function (dot, position) {
      dot.addEventListener("click", function () {
        show(position);
      });
    });
    window.setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  function initLocalFilters() {
    $all(".local-filter").forEach(function (input) {
      var scopeId = input.getAttribute("data-filter-scope");
      var scope = scopeId ? document.getElementById(scopeId) : document;
      if (!scope) {
        return;
      }
      var cards = $all(".movie-card", scope);
      function apply(value) {
        var query = String(value || "").trim().toLowerCase();
        cards.forEach(function (card) {
          var text = (card.getAttribute("data-card-text") || card.textContent || "").toLowerCase();
          card.classList.toggle("is-hidden-card", query && text.indexOf(query) === -1);
        });
      }
      input.addEventListener("input", function () {
        apply(input.value);
      });
      var bar = input.closest(".filter-bar");
      if (bar) {
        $all("[data-filter-chip]", bar).forEach(function (chip) {
          chip.addEventListener("click", function () {
            var active = chip.classList.toggle("is-active");
            $all("[data-filter-chip]", bar).forEach(function (other) {
              if (other !== chip) {
                other.classList.remove("is-active");
              }
            });
            input.value = active ? chip.getAttribute("data-filter-chip") : "";
            apply(input.value);
          });
        });
      }
    });
  }

  function initSearchPage() {
    var results = document.getElementById("searchResults");
    var input = document.getElementById("searchInput");
    var summary = document.getElementById("searchSummary");
    if (!results || !input || !window.SITE_MOVIES) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var initial = params.get("q") || "";
    input.value = initial;
    function render(query) {
      var value = String(query || "").trim().toLowerCase();
      var list = window.SITE_MOVIES.filter(function (movie) {
        var haystack = [movie.title, movie.region, movie.type, movie.year, movie.genre, (movie.tags || []).join(" "), movie.line].join(" ").toLowerCase();
        return !value || haystack.indexOf(value) !== -1;
      }).slice(0, 120);
      summary.textContent = value ? "搜索结果" : "推荐片单";
      results.innerHTML = list.map(function (movie) {
        var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
          return "<span>" + escapeHtml(tag) + "</span>";
        }).join("");
        return "<article class=\"movie-card\">" +
          "<a class=\"poster-link\" href=\"" + escapeHtml(movie.url) + "\"><img src=\"" + escapeHtml(movie.cover) + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\"><span class=\"quality-badge\">高清</span><span class=\"score-badge\">★ " + escapeHtml(movie.rating) + "</span><span class=\"poster-play\">▶</span></a>" +
          "<div class=\"movie-body\"><div class=\"movie-meta\"><span>" + escapeHtml(movie.year) + "</span><span>" + escapeHtml(movie.region) + "</span><span>" + escapeHtml(movie.type) + "</span></div><h3><a href=\"" + escapeHtml(movie.url) + "\">" + escapeHtml(movie.title) + "</a></h3><p>" + escapeHtml(movie.line) + "</p><div class=\"tag-row\">" + tags + "</div></div></article>";
      }).join("");
    }
    render(initial);
    input.addEventListener("input", function () {
      render(input.value);
    });
  }

  window.setupMoviePlayer = function (videoId, layerId, sourceUrl) {
    var video = document.getElementById(videoId);
    var layer = document.getElementById(layerId);
    if (!video || !sourceUrl) {
      return;
    }
    var initialized = false;
    var hls = null;
    function attachSource() {
      if (initialized) {
        return;
      }
      initialized = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = sourceUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(sourceUrl);
        hls.attachMedia(video);
      } else {
        video.src = sourceUrl;
      }
      video.setAttribute("controls", "controls");
    }
    function playVideo() {
      attachSource();
      if (layer) {
        layer.classList.add("is-hidden");
      }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {
          if (layer) {
            layer.classList.remove("is-hidden");
          }
        });
      }
    }
    if (layer) {
      layer.addEventListener("click", playVideo);
    }
    video.addEventListener("click", function () {
      if (video.paused) {
        playVideo();
      }
    });
    window.addEventListener("beforeunload", function () {
      if (hls && typeof hls.destroy === "function") {
        hls.destroy();
      }
    });
  };

  document.addEventListener("DOMContentLoaded", function () {
    initMobileMenu();
    initHero();
    initLocalFilters();
    initSearchPage();
  });
})();
