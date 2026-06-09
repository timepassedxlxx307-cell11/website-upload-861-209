const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

const hero = document.querySelector(".hero");
if (hero) {
  const slides = Array.from(hero.querySelectorAll(".hero-slide"));
  const dots = Array.from(hero.querySelectorAll(".hero-dot"));
  let activeIndex = 0;

  const showSlide = (index) => {
    if (!slides.length) {
      return;
    }

    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === activeIndex);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === activeIndex);
    });
  };

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = Number(dot.dataset.slide || 0);
      showSlide(index);
    });
  });

  setInterval(() => {
    showSlide(activeIndex + 1);
  }, 5200);
}

const filterInput = document.querySelector(".card-filter");
if (filterInput) {
  const cards = Array.from(document.querySelectorAll(".movie-card"));
  filterInput.addEventListener("input", () => {
    const keyword = filterInput.value.trim().toLowerCase();
    cards.forEach((card) => {
      const text = [card.dataset.title, card.dataset.genre, card.dataset.region, card.dataset.year].join(" ").toLowerCase();
      card.style.display = text.includes(keyword) ? "" : "none";
    });
  });
}

document.querySelectorAll("img").forEach((image) => {
  image.addEventListener("error", () => {
    image.classList.add("image-missing");
  });
});
