(function () {
    "use strict";

    function all(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function initMenu() {
        var button = document.querySelector("[data-menu-button]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!button || !nav) {
            return;
        }
        button.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function initHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = all(".hero-slide", hero);
        var dots = all("[data-hero-dot]", hero);
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        if (slides.length === 0) {
            return;
        }
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function start() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
                start();
            });
        });
        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                start();
            });
        }
        show(0);
        start();
    }

    function initSearch() {
        all("[data-search-form]").forEach(function (form) {
            var input = form.querySelector("[data-movie-search]");
            var region = form.querySelector("[data-region-filter]");
            var kind = form.querySelector("[data-kind-filter]");
            var cards = all(".movie-card", form);
            var empty = form.querySelector("[data-empty-state]");
            if (!input && !region && !kind) {
                return;
            }

            function update() {
                var term = input ? input.value.trim().toLowerCase() : "";
                var selectedRegion = region ? region.value : "";
                var selectedKind = kind ? kind.value : "";
                var visibleCount = 0;
                cards.forEach(function (card) {
                    var text = (card.getAttribute("data-search") || "").toLowerCase();
                    var cardRegion = card.getAttribute("data-region") || "";
                    var cardKind = card.getAttribute("data-kind") || "";
                    var ok = true;
                    if (term && text.indexOf(term) === -1) {
                        ok = false;
                    }
                    if (selectedRegion && cardRegion !== selectedRegion) {
                        ok = false;
                    }
                    if (selectedKind && cardKind !== selectedKind) {
                        ok = false;
                    }
                    card.classList.toggle("is-hidden", !ok);
                    if (ok) {
                        visibleCount += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle("is-visible", visibleCount === 0);
                }
            }

            [input, region, kind].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", update);
                    control.addEventListener("change", update);
                }
            });
            update();
        });
    }

    function initPlayer() {
        var box = document.querySelector("[data-player]");
        if (!box) {
            return;
        }
        var video = box.querySelector("video");
        var overlay = box.querySelector("[data-player-overlay]");
        var button = box.querySelector("[data-play-button]");
        if (!video) {
            return;
        }
        var stream = video.getAttribute("data-stream") || "";
        var loaded = false;
        var hls = null;

        function hideOverlay() {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
        }

        function playVideo() {
            var result = video.play();
            if (result && typeof result.catch === "function") {
                result.catch(function () {});
            }
        }

        function attach() {
            if (!stream) {
                return;
            }
            hideOverlay();
            if (loaded) {
                playVideo();
                return;
            }
            loaded = true;
            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    playVideo();
                });
                hls.on(window.Hls.Events.ERROR, function (event, data) {
                    if (!data || !data.fatal || !hls) {
                        return;
                    }
                    if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                        hls.startLoad();
                    } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                        hls.recoverMediaError();
                    } else {
                        hls.destroy();
                    }
                });
            } else {
                video.src = stream;
                playVideo();
            }
        }

        if (overlay) {
            overlay.addEventListener("click", attach);
        }
        if (button) {
            button.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();
                attach();
            });
        }
        video.addEventListener("click", function () {
            if (video.paused) {
                attach();
            }
        });
        video.addEventListener("play", hideOverlay);
        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        initMenu();
        initHero();
        initSearch();
        initPlayer();
    });
})();
