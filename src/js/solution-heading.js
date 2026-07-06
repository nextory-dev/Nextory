export function initSolutionHeadingUnderline() {
  const headings = document.querySelectorAll(".botfender-page .section-heading");

  if (!headings.length) return;

  if (!("IntersectionObserver" in window)) {
    headings.forEach((heading) => heading.classList.add("underline-animate"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("underline-animate", entry.isIntersecting);
      });
    },
    {
      threshold: 0.45,
      rootMargin: "0px 0px -12% 0px",
    },
  );

  headings.forEach((heading) => observer.observe(heading));
}
