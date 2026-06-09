(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobilePanel = document.querySelector('.mobile-panel');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      var isOpen = !mobilePanel.hasAttribute('hidden');
      if (isOpen) {
        mobilePanel.setAttribute('hidden', '');
        menuButton.setAttribute('aria-expanded', 'false');
      } else {
        mobilePanel.removeAttribute('hidden');
        menuButton.setAttribute('aria-expanded', 'true');
      }
    });
  }

  var carousel = document.querySelector('[data-carousel]');

  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dot'));
    var prev = carousel.querySelector('.hero-prev');
    var next = carousel.querySelector('.hero-next');
    var current = 0;
    var timer = null;

    var showSlide = function (index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    };

    var restart = function () {
      if (timer) {
        window.clearInterval(timer);
      }

      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    };

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-slide') || 0));
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        restart();
      });
    }

    showSlide(0);
    restart();
  }

  var filterForm = document.querySelector('[data-filter-form]');
  var filterList = document.querySelector('[data-filter-list]');

  if (filterForm && filterList) {
    var input = filterForm.querySelector('input');
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';

    if (input && initialQuery) {
      input.value = initialQuery;
    }

    var applyFilter = function () {
      var query = input ? input.value.trim().toLowerCase() : '';
      var cards = Array.prototype.slice.call(filterList.querySelectorAll('.movie-card'));

      cards.forEach(function (card) {
        var text = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
        card.classList.toggle('hidden-by-filter', Boolean(query) && text.indexOf(query) === -1);
      });
    };

    filterForm.addEventListener('submit', function (event) {
      event.preventDefault();
      applyFilter();
    });

    if (input) {
      input.addEventListener('input', applyFilter);
    }

    applyFilter();
  }
})();
