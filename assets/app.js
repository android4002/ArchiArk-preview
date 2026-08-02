(() => {
  const menu = document.querySelector("#site-menu");
  const menuToggle = document.querySelector(".menu-toggle");
  const menuClose = document.querySelector("[data-menu-close]");
  const main = document.querySelector("main");
  const footer = document.querySelector("footer");
  let previousFocus = null;

  const focusable = (root) => [...root.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')];
  const setBackgroundInert = (state) => {
    for (const element of [main, footer]) {
      if (!element) continue;
      if (state) element.setAttribute("inert", "");
      else element.removeAttribute("inert");
    }
  };

  const openMenu = () => {
    if (!menu || !menuToggle) return;
    previousFocus = document.activeElement;
    setBackgroundInert(true);
    menu.showModal();
    menuToggle.setAttribute("aria-expanded", "true");
    document.documentElement.classList.add("menu-open");
    menuClose?.focus();
  };

  const closeMenu = () => {
    if (!menu?.open) return;
    menu.close();
    setBackgroundInert(false);
    menuToggle?.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("menu-open");
    previousFocus?.focus?.();
  };

  menuToggle?.addEventListener("click", openMenu);
  menuClose?.addEventListener("click", closeMenu);
  menu?.addEventListener("click", (event) => {
    if (event.target === menu) closeMenu();
  });
  menu?.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !menu?.open) return;
    event.preventDefault();
    closeMenu();
  });
  menu?.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const items = focusable(menu);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  const filterButtons = [...document.querySelectorAll("[data-filter]")];
  const projectCards = [...document.querySelectorAll("[data-project-card]")];
  const emptyState = document.querySelector("[data-empty-state]");
  const applyFilter = (value) => {
    let visible = 0;
    for (const button of filterButtons) button.setAttribute("aria-pressed", String(button.dataset.filter === value));
    for (const card of projectCards) {
      const show = value === "Все" || card.dataset.type === value;
      card.hidden = !show;
      if (show) visible += 1;
    }
    if (emptyState) emptyState.hidden = visible !== 0;
  };
  for (const button of filterButtons) button.addEventListener("click", () => applyFilter(button.dataset.filter));
  document.querySelector("[data-filter-reset]")?.addEventListener("click", () => applyFilter("Все"));

  const lightbox = document.querySelector(".lightbox");
  const lightboxImage = lightbox?.querySelector("img");
  const lightboxStatus = lightbox?.querySelector("[data-lightbox-status]");
  const galleryButtons = [...document.querySelectorAll("[data-lightbox-src]")];
  let currentImage = 0;
  let galleryTrigger = null;

  const showImage = (index) => {
    if (!lightboxImage || !galleryButtons.length) return;
    currentImage = (index + galleryButtons.length) % galleryButtons.length;
    const trigger = galleryButtons[currentImage];
    lightboxImage.src = trigger.dataset.lightboxSrc;
    lightboxImage.alt = trigger.dataset.lightboxAlt || "";
    if (lightboxStatus) {
      lightboxStatus.textContent = lightboxImage.alt;
    }
  };
  const openLightbox = (button, index) => {
    if (!lightbox) return;
    galleryTrigger = button;
    showImage(index);
    lightbox.showModal();
    lightbox.querySelector("[data-lightbox-close]")?.focus();
  };
  const closeLightbox = () => {
    if (!lightbox?.open) return;
    lightbox.close();
    galleryTrigger?.focus();
  };
  galleryButtons.forEach((button, index) => button.addEventListener("click", () => openLightbox(button, index)));
  lightbox?.querySelector("[data-lightbox-close]")?.addEventListener("click", closeLightbox);
  lightbox?.querySelector("[data-lightbox-prev]")?.addEventListener("click", () => showImage(currentImage - 1));
  lightbox?.querySelector("[data-lightbox-next]")?.addEventListener("click", () => showImage(currentImage + 1));
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  lightbox?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeLightbox();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      showImage(currentImage - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showImage(currentImage + 1);
    }
  });
  lightbox?.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeLightbox();
  });

  for (const details of document.querySelectorAll(".faq details")) {
    details.addEventListener("toggle", () => {
      const indicator = details.querySelector("summary span");
      if (indicator) indicator.textContent = details.open ? "−" : "+";
    });
  }
})();
