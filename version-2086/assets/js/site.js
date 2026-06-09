(function () {
    const menuButton = document.querySelector('[data-menu-toggle]');
    const mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    const hero = document.querySelector('[data-hero]');

    if (hero) {
        const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
        const previous = hero.querySelector('[data-hero-prev]');
        const next = hero.querySelector('[data-hero-next]');
        let activeIndex = 0;
        let timer = null;

        const showSlide = function (index) {
            if (!slides.length) {
                return;
            }

            activeIndex = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === activeIndex);
            });
        };

        const startTimer = function () {
            if (timer) {
                window.clearInterval(timer);
            }

            timer = window.setInterval(function () {
                showSlide(activeIndex + 1);
            }, 5200);
        };

        if (previous) {
            previous.addEventListener('click', function () {
                showSlide(activeIndex - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(activeIndex + 1);
                startTimer();
            });
        }

        startTimer();
    }

    const forms = Array.from(document.querySelectorAll('[data-filter-form]'));

    forms.forEach(function (form) {
        const targetSelector = form.getAttribute('data-target');
        const grid = targetSelector ? document.querySelector(targetSelector) : null;
        const emptyState = grid ? grid.parentElement.querySelector('[data-empty-state]') : null;

        if (!grid) {
            return;
        }

        const cards = Array.from(grid.querySelectorAll('.movie-card'));
        const runFilter = function () {
            const formData = new FormData(form);
            const query = String(formData.get('q') || '').trim().toLowerCase();
            const type = String(formData.get('type') || '').trim().toLowerCase();
            const genre = String(formData.get('genre') || '').trim().toLowerCase();
            const year = String(formData.get('year') || '').trim().toLowerCase();
            let visible = 0;

            cards.forEach(function (card) {
                const searchText = String(card.dataset.search || '').toLowerCase();
                const cardType = String(card.dataset.type || '').toLowerCase();
                const cardGenre = String(card.dataset.genre || '').toLowerCase();
                const cardYear = String(card.dataset.year || '').toLowerCase();
                const matchesQuery = !query || searchText.indexOf(query) !== -1;
                const matchesType = !type || cardType.indexOf(type) !== -1;
                const matchesGenre = !genre || cardGenre.indexOf(genre) !== -1;
                const matchesYear = !year || cardYear === year;
                const show = matchesQuery && matchesType && matchesGenre && matchesYear;

                card.classList.toggle('is-filtered-out', !show);

                if (show) {
                    visible += 1;
                }
            });

            if (emptyState) {
                emptyState.classList.toggle('is-visible', visible === 0);
            }
        };

        form.addEventListener('input', runFilter);
        form.addEventListener('change', runFilter);
        form.addEventListener('reset', function () {
            window.setTimeout(runFilter, 0);
        });
    });

    Array.from(document.querySelectorAll('img')).forEach(function (image) {
        image.addEventListener('error', function () {
            image.remove();
        }, { once: true });
    });
})();
