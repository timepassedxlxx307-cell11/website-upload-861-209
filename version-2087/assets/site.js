document.addEventListener("DOMContentLoaded", function () {
    initNavigation();
    initHeroCarousel();
    initLocalSearch();
    initPlayer();
});

function initNavigation() {
    var button = document.querySelector("[data-nav-toggle]");
    var menu = document.querySelector("[data-mobile-nav]");

    if (!button || !menu) {
        return;
    }

    button.addEventListener("click", function () {
        menu.classList.toggle("is-open");
        document.body.classList.toggle("nav-open", menu.classList.contains("is-open"));
    });

    menu.addEventListener("click", function (event) {
        if (event.target.tagName === "A") {
            menu.classList.remove("is-open");
            document.body.classList.remove("nav-open");
        }
    });
}

function initHeroCarousel() {
    var hero = document.querySelector("[data-hero]");

    if (!hero) {
        return;
    }

    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var nextButton = hero.querySelector("[data-hero-next]");
    var prevButton = hero.querySelector("[data-hero-prev]");
    var active = 0;
    var timer = null;

    function show(index) {
        active = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle("is-active", slideIndex === active);
            slide.setAttribute("aria-hidden", slideIndex === active ? "false" : "true");
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle("is-active", dotIndex === active);
        });
    }

    function start() {
        stop();
        timer = window.setInterval(function () {
            show(active + 1);
        }, 5200);
    }

    function stop() {
        if (timer) {
            window.clearInterval(timer);
            timer = null;
        }
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            show(index);
            start();
        });
    });

    if (nextButton) {
        nextButton.addEventListener("click", function () {
            show(active + 1);
            start();
        });
    }

    if (prevButton) {
        prevButton.addEventListener("click", function () {
            show(active - 1);
            start();
        });
    }

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
}

function initLocalSearch() {
    var inputs = Array.prototype.slice.call(document.querySelectorAll("[data-filter-input]"));

    inputs.forEach(function (input) {
        var target = input.getAttribute("data-filter-target");
        var scope = target ? document.querySelector(target) : document;
        var cards = scope ? Array.prototype.slice.call(scope.querySelectorAll("[data-movie-card]")) : [];

        function apply() {
            var query = input.value.trim().toLowerCase();

            cards.forEach(function (card) {
                var haystack = card.getAttribute("data-search") || card.textContent.toLowerCase();
                card.hidden = query !== "" && haystack.indexOf(query) === -1;
            });
        }

        input.addEventListener("input", apply);
        apply();
    });
}

function initPlayer() {
    var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));

    players.forEach(function (shell) {
        var video = shell.querySelector("video");
        var cover = shell.querySelector(".player-cover");
        var triggers = Array.prototype.slice.call(shell.querySelectorAll("[data-play-trigger]"));
        var stream = shell.getAttribute("data-stream");
        var loaded = false;
        var hls = null;

        if (!video || !stream) {
            return;
        }

        function bindStream() {
            if (loaded) {
                return;
            }

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
            } else {
                video.src = stream;
            }

            loaded = true;
        }

        function play() {
            bindStream();
            shell.classList.add("is-playing");
            var result = video.play();

            if (result && typeof result.catch === "function") {
                result.catch(function () {});
            }
        }

        triggers.forEach(function (trigger) {
            trigger.addEventListener("click", function (event) {
                event.preventDefault();
                play();
            });
        });

        if (cover) {
            cover.addEventListener("click", play);
        }

        video.addEventListener("click", function () {
            if (!loaded || video.paused) {
                play();
            }
        });

        video.addEventListener("play", function () {
            shell.classList.add("is-playing");
        });

        video.addEventListener("ended", function () {
            shell.classList.remove("is-playing");
        });

        window.addEventListener("pagehide", function () {
            if (hls) {
                hls.destroy();
                hls = null;
            }
        });
    });
}
