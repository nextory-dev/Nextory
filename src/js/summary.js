const positionClasses = ["is-active", "is-right-top", "is-right-bottom", "is-left-bottom", "is-left-top"];
const rotationDelay = 5200;

document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector("[data-competitiveness-slider]");
  if (!slider) return;

  const cards = Array.from(slider.querySelectorAll("[data-competitiveness-card]"));
  if (cards.length < 2) return;

  let activeIndex = 0;
  let timer = window.setInterval(rotate, rotationDelay);

  slider.addEventListener("mouseenter", () => window.clearInterval(timer));
  slider.addEventListener("mouseleave", () => {
    timer = window.setInterval(rotate, rotationDelay);
  });

  cards.forEach((card, index) => {
    card.addEventListener("click", () => {
      activeIndex = index;
      updateCards();
    });
  });

  updateCards();

  function rotate() {
    activeIndex = (activeIndex + 1) % cards.length;
    updateCards();
  }

  function updateCards() {
    cards.forEach((card, index) => {
      card.classList.remove(...positionClasses);
      card.classList.add(positionClasses[(index - activeIndex + cards.length) % cards.length]);
    });
  }
});
