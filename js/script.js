/* ============================================================
   London Luxe Detailing — Main JavaScript
   ------------------------------------------------------------
   Lightweight vanilla JS for:
   1. Header scroll state
   2. Mobile navigation toggle
   3. Reveal-on-scroll (IntersectionObserver)
   4. FAQ accordion
   5. Before/After image comparison slider
   6. Contact form (demo — no backend)

   No dependencies. Respects prefers-reduced-motion.
   ============================================================ */

(function () {
  "use strict";

  /* ========================================================
     1. HEADER SCROLL STATE
     Adds .is-scrolled when page is scrolled past the hero top
     ======================================================== */
  const header = document.getElementById("site-header");

  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ========================================================
     2. MOBILE NAVIGATION TOGGLE
     ======================================================== */
  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");

  if (navToggle && mainNav) {
    const closeNav = () => {
      navToggle.classList.remove("is-open");
      mainNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Deschide meniul");
    };

    const openNav = () => {
      navToggle.classList.add("is-open");
      mainNav.classList.add("is-open");
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.setAttribute("aria-label", "Închide meniul");
    };

    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.classList.contains("is-open");
      isOpen ? closeNav() : openNav();
    });

    /* Close on link click (mobile) */
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    /* Close on outside click */
    document.addEventListener("click", (e) => {
      if (
        mainNav.classList.contains("is-open") &&
        !mainNav.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        closeNav();
      }
    });

    /* Close on Escape */
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ========================================================
     3. REVEAL-ON-SCROLL
     Adds .is-visible to .reveal elements when they enter viewport
     ======================================================== */
  const revealEls = document.querySelectorAll(".reveal");

  if (revealEls.length > 0) {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      /* Show everything immediately */
      revealEls.forEach((el) => el.classList.add("is-visible"));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
      );

      revealEls.forEach((el) => observer.observe(el));
    }
  }

  /* ========================================================
     4. FAQ ACCORDION
     Accessible accordion using aria-expanded and hidden
     ======================================================== */
  const accordionTriggers = document.querySelectorAll(".accordion__trigger");

  accordionTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      const panel = document.getElementById(
        trigger.getAttribute("aria-controls")
      );

      /* Close all other items (single-open accordion) */
      accordionTriggers.forEach((other) => {
        if (other !== trigger) {
          other.setAttribute("aria-expanded", "false");
          const otherPanel = document.getElementById(
            other.getAttribute("aria-controls")
          );
          if (otherPanel) otherPanel.hidden = true;
        }
      });

      /* Toggle current item */
      trigger.setAttribute("aria-expanded", String(!expanded));
      if (panel) panel.hidden = expanded;
    });
  });

  /* ========================================================
     5. BEFORE/AFTER IMAGE COMPARISON SLIDER
     Drag or use arrow keys to compare before/after images
     ======================================================== */
  const baSliders = document.querySelectorAll("[data-ba-slider]");

  baSliders.forEach((slider) => {
    const beforeLayer = slider.querySelector(".ba-slider__before");
    const handle = slider.querySelector(".ba-slider__handle");
    let isDragging = false;

    const updateSlider = (percent) => {
      percent = Math.max(0, Math.min(100, percent));
      beforeLayer.style.clipPath = `inset(0 0 0 ${percent}%)`;
      handle.style.left = `${percent}%`;
      handle.setAttribute("aria-valuenow", Math.round(percent));
    };

    const getPercentFromEvent = (clientX) => {
      const rect = slider.getBoundingClientRect();
      return ((clientX - rect.left) / rect.width) * 100;
    };

    /* Mouse events */
    slider.addEventListener("mousedown", (e) => {
      isDragging = true;
      updateSlider(getPercentFromEvent(e.clientX));
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) updateSlider(getPercentFromEvent(e.clientX));
    });

    document.addEventListener("mouseup", () => {
      isDragging = false;
    });

    /* Touch events */
    slider.addEventListener("touchstart", (e) => {
      isDragging = true;
      updateSlider(getPercentFromEvent(e.touches[0].clientX));
    }, { passive: true });

    slider.addEventListener("touchmove", (e) => {
      if (isDragging) {
        e.preventDefault();
        updateSlider(getPercentFromEvent(e.touches[0].clientX));
      }
    }, { passive: false });

    slider.addEventListener("touchend", () => {
      isDragging = false;
    });

    /* Keyboard support on handle */
    handle.addEventListener("keydown", (e) => {
      const current = parseFloat(handle.getAttribute("aria-valuenow")) || 50;
      if (e.key === "ArrowLeft") {
        updateSlider(current - 5);
        e.preventDefault();
      } else if (e.key === "ArrowRight") {
        updateSlider(current + 5);
        e.preventDefault();
      }
    });

    /* Initialize at 50% */
    updateSlider(50);
  });

  /* ========================================================
     6. CONTACT FORM (DEMO)
     No backend — shows a success message on submit.
     Replace with real form submission when backend is ready.
     ======================================================== */
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const successMsg = document.getElementById("contact-form-success");
      if (successMsg) {
        successMsg.classList.add("is-visible");
        successMsg.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      contactForm.reset();
    });
  }

  /* ========================================================
     7. SET ACTIVE NAV LINK BASED ON CURRENT PAGE
     ======================================================== */
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".main-nav__link");

  navLinks.forEach((link) => {
    const linkPath = link.getAttribute("href");
    /* Mark as active if paths match (ignoring trailing slashes) */
    const normalize = (p) => p.replace(/\/$/, "") || "/";
    if (normalize(linkPath) === normalize(currentPath)) {
      link.classList.add("is-active");
    } else {
      link.classList.remove("is-active");
    }
  });
})();
