(function () {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  const backTop = document.querySelector('[data-back-top]');

  if (backTop) {
    window.addEventListener('scroll', function () {
      backTop.classList.toggle('visible', window.scrollY > 420);
    });

    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  const dotsWrap = document.querySelector('[data-hero-dots]');

  if (slides.length > 1 && dotsWrap) {
    const dots = Array.from(dotsWrap.querySelectorAll('button'));
    let current = 0;

    const showSlide = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    };

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });

    window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  const params = new URLSearchParams(window.location.search);
  const queryValue = params.get('q') || '';
  const queryInput = document.querySelector('[data-query-input]');

  if (queryInput) {
    queryInput.value = queryValue;
  }

  const filterInput = document.querySelector('[data-filter-input]');
  const cardList = document.querySelector('[data-card-list]');
  const emptyState = document.querySelector('[data-empty-state]');

  if (filterInput && cardList) {
    const cards = Array.from(cardList.querySelectorAll('.movie-card'));

    const filterCards = function () {
      const query = filterInput.value.trim().toLowerCase();
      let visibleCount = 0;

      cards.forEach(function (card) {
        const haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-tags'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region')
        ].join(' ').toLowerCase();
        const matched = !query || haystack.indexOf(query) !== -1;
        card.hidden = !matched;
        if (matched) {
          visibleCount += 1;
        }
      });

      if (emptyState) {
        emptyState.hidden = visibleCount !== 0;
      }
    };

    filterInput.addEventListener('input', filterCards);
    filterCards();
  }
})();
