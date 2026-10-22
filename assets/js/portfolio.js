const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const menuToggle = document.querySelector("#menu-toggle");
const siteNavigation = document.querySelector("#site-navigation");

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  siteNavigation.classList.remove("is-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Open navigation" : "Close navigation",
  );
  siteNavigation.classList.toggle("is-open", !isOpen);
});

siteNavigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const progress = document.querySelector("#scroll-progress");
let scrollQueued = false;

function updateScrollProgress() {
  const scrollableHeight =
    document.documentElement.scrollHeight - window.innerHeight;
  const amount =
    scrollableHeight > 0
      ? Math.min(100, (window.scrollY / scrollableHeight) * 100)
      : 0;
  progress.style.width = `${amount}%`;
  scrollQueued = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!scrollQueued) {
      window.requestAnimationFrame(updateScrollProgress);
      scrollQueued = true;
    }
  },
  { passive: true },
);
updateScrollProgress();

const sections = [...document.querySelectorAll("main section[id]")];
const navigationLinks = [...siteNavigation.querySelectorAll('a[href^="#"]')];

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navigationLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${entry.target.id}`) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px" },
  );

  sections.forEach((section) => sectionObserver.observe(section));

  if (!reducedMotion) {
    document.documentElement.classList.add("motion-ready");
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );

    document
      .querySelectorAll(".reveal")
      .forEach((item) => revealObserver.observe(item));
  }
}

const rotatingWords = document.querySelector("#rotating-words");
if (rotatingWords && !reducedMotion) {
  const specialties = [
    "Java · Spring Boot · Microservices · Cloud",
    "Angular · APIs · Enterprise software",
    "Secure systems · Reliable releases",
  ];
  let specialtyIndex = 0;
  window.setInterval(() => {
    specialtyIndex = (specialtyIndex + 1) % specialties.length;
    rotatingWords.textContent = specialties[specialtyIndex];
  }, 2800);
}

document.querySelectorAll("[data-skill-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.skillFilter;
    document.querySelectorAll("[data-skill-filter]").forEach((filter) => {
      const selected = filter === button;
      filter.classList.toggle("is-active", selected);
      filter.setAttribute("aria-pressed", String(selected));
    });
    document.querySelectorAll("[data-skill-category]").forEach((panel) => {
      panel.hidden =
        category !== "all" && panel.dataset.skillCategory !== category;
    });
  });
});

const projectCards = [...document.querySelectorAll("[data-project-tags]")];
const emptyProjects = document.querySelector("#project-empty");
document.querySelectorAll("[data-project-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.projectFilter;
    let visibleCount = 0;
    document.querySelectorAll("[data-project-filter]").forEach((filter) => {
      const selected = filter === button;
      filter.classList.toggle("is-active", selected);
      filter.setAttribute("aria-pressed", String(selected));
    });
    projectCards.forEach((card) => {
      const visible =
        category === "all" ||
        card.dataset.projectTags.split(" ").includes(category);
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    emptyProjects.hidden = visibleCount !== 0;
  });
});

const copyButton = document.querySelector("#copy-email");
const copyStatus = document.querySelector("#copy-status");
copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("zaheertoday@gmail.com");
    copyStatus.textContent = "Copied";
  } catch {
    copyStatus.textContent = "Select the email link to copy it";
  }
});
