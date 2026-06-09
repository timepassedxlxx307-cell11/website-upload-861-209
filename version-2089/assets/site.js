(function () {
  const menuButton = document.querySelector('[data-menu-toggle]');

  if (menuButton) {
    menuButton.addEventListener('click', function () {
      document.body.classList.toggle('menu-open');
    });
  }

  const slider = document.querySelector('[data-hero-slider]');

  if (slider) {
    const slides = Array.from(slider.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(slider.querySelectorAll('[data-hero-dot]'));
    const previous = slider.querySelector('[data-hero-prev]');
    const next = slider.querySelector('[data-hero-next]');
    let index = 0;
    let timer = null;

    function showSlide(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function startAutoPlay() {
      stopAutoPlay();
      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    function stopAutoPlay() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showSlide(dotIndex);
        startAutoPlay();
      });
    });

    if (previous) {
      previous.addEventListener('click', function () {
        showSlide(index - 1);
        startAutoPlay();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(index + 1);
        startAutoPlay();
      });
    }

    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);
    startAutoPlay();
  }
})();
