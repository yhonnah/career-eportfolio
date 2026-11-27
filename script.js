(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Theme initialization
  const savedTheme = localStorage.getItem("portfolio-theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
  root.setAttribute("data-theme", initialTheme);
  if (themeIcon) {
    themeIcon.textContent = initialTheme === "dark" ? "☀" : "☾";
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("portfolio-theme", next);
      if (themeIcon) {
        themeIcon.textContent = next === "dark" ? "☀" : "☾";
      }
    });
  }

  // Mobile nav toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Academic project filter tabs
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");

      projectCards.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("hidden", !match);
      });
    });
  });

  // Horizontal carousel arrow helper with auto-hide at bounds
  const carouselUpdaters = [];
  const initCarousel = (trackId, prevId, nextId, cardSelector) => {
    const track = document.getElementById(trackId);
    const prev = document.getElementById(prevId);
    const next = document.getElementById(nextId);
    if (!track || !prev || !next) return;

    const updateArrows = () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll <= 2) {
        prev.hidden = true;
        next.hidden = true;
        return;
      }
      prev.hidden = track.scrollLeft <= 2;
      next.hidden = track.scrollLeft >= maxScroll - 2;
    };

    const getStep = () => {
      const card = track.querySelector(cardSelector);
      return card ? card.getBoundingClientRect().width + 24 : 360;
    };

    prev.addEventListener("click", () => {
      track.scrollBy({ left: -getStep(), behavior: "smooth" });
    });

    next.addEventListener("click", () => {
      track.scrollBy({ left: getStep(), behavior: "smooth" });
    });

    track.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    carouselUpdaters.push(updateArrows);
    updateArrows();
  };

  initCarousel("projectsGrid", "projectsPrev", "projectsNext", ".project-card:not(.hidden)");
  initCarousel("expTimeline", "expPrev", "expNext", ".exp-card");
  initCarousel("galleryTrack", "galleryPrev", "galleryNext", ".gallery-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const projectsGrid = document.getElementById("projectsGrid");
      if (projectsGrid) projectsGrid.scrollLeft = 0;
      requestAnimationFrame(() => carouselUpdaters.forEach((fn) => fn()));
    });
  });
})();
