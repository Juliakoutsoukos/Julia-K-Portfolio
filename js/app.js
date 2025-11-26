// ==============================
// Julia Portfolio — app.js
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  setYearStamp();
  initGlassOrb();
  initWorkReveal();
  initWorkFilters();
  initPageTransitions();
  initScrollProgress();
  initContactCardTilt();
  initHomeScrollEffects(); // fun scroll ONLY on home
});

// ------------------------------
// 1. Year stamp (footer)
// ------------------------------
function setYearStamp() {
  const yEl = document.getElementById("y");
  if (!yEl) return;
  yEl.textContent = new Date().getFullYear();
}

// ------------------------------
// 2. Glass orb interactions
// ------------------------------
function initGlassOrb() {
  const orb = document.querySelector(".glass-orb");
  if (!orb) return;

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) return;

  let targetHX = 30,
    targetHY = 25,
    targetGlow = 24;
  let rotX = 0,
    rotY = 0,
    ty = 0;

  let curHX = targetHX,
    curHY = targetHY,
    curGlow = targetGlow,
    curRotX = 0,
    curRotY = 0,
    curTY = 0;

  const lerp = (a, b, t) => a + (b - a) * t;

  const handleMouseMove = (e) => {
    const r = orb.getBoundingClientRect();
    if (!r.width || !r.height) return;

    const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2); // -1..1
    const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2); // -1..1

    targetHX = 50 + nx * 25;
    targetHY = 50 + ny * 25;
    targetGlow = 22 + (1 - (ny + 1) / 2) * 12;

    rotY = nx * 6;
    rotX = -ny * 6;
  };

  window.addEventListener("mousemove", handleMouseMove, { passive: true });

  const handleScroll = () => {
    const y = Math.min(window.scrollY, 240);
    ty = y * 0.05;
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  function tick() {
    curHX = lerp(curHX, targetHX, 0.12);
    curHY = lerp(curHY, targetHY, 0.12);
    curGlow = lerp(curGlow, targetGlow, 0.1);
    curRotX = lerp(curRotX, rotX, 0.1);
    curRotY = lerp(curRotY, rotY, 0.1);
    curTY = lerp(curTY, ty, 0.1);

    orb.style.setProperty("--hx", curHX.toFixed(2));
    orb.style.setProperty("--hy", curHY.toFixed(2));
    orb.style.setProperty("--glow", `${curGlow.toFixed(0)}px`);
    orb.style.transform = `translateY(${curTY}px) rotateX(${curRotX}deg) rotateY(${curRotY}deg)`;

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

// ------------------------------
// 3. Work page scroll reveal
// ------------------------------
function initWorkReveal() {
  const cards = document.querySelectorAll(".wcard");
  if (!cards.length) return;

  cards.forEach((card) => {
    card.classList.add("wcard--hidden");
  });

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    cards.forEach((card) => {
      card.classList.remove("wcard--hidden");
      card.classList.add("wcard--visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("wcard--hidden");
          entry.target.classList.add("wcard--visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  cards.forEach((card) => observer.observe(card));
}

// ------------------------------
// 4. (Optional) Work filters
// ------------------------------
function initWorkFilters() {
  const filters = document.querySelectorAll(".filter");
  const cards = document.querySelectorAll(".wcard");

  if (!filters.length || !cards.length) return;

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      filters.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
      });

      const sel = btn.dataset.filter;

      cards.forEach((card) => {
        if (sel === "all" || !sel) {
          card.style.display = "";
          return;
        }
        const cats = (card.dataset.cat || "").split(" ");
        card.style.display = cats.includes(sel) ? "" : "none";
      });
    });
  });
}

// ------------------------------
// 5. Page transitions (all pages)
// ------------------------------
function initPageTransitions() {
  const body = document.body;
  if (!body) return;

  body.classList.add("page-enter");

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) return;

  const links = document.querySelectorAll(
    'a[href$=".html"]:not([target="_blank"])'
  );

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      if (
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        e.button !== 0
      ) {
        return;
      }

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      e.preventDefault();
      body.classList.add("page-exit");

      setTimeout(() => {
        window.location.href = href;
      }, 220);
    });
  });
}

// ------------------------------
// 6. Scroll progress bar (all pages)
// ------------------------------
function initScrollProgress() {
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  document.body.appendChild(bar);

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const update = () => {
    if (prefersReduced) {
      bar.style.width = "0";
      return;
    }
    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop;
    const docHeight = doc.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + "%";
  };

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

// ------------------------------
// 7. Contact card tilt (Contact page)
// ------------------------------
function initContactCardTilt() {
  const cards = document.querySelectorAll(".contact-card");
  if (!cards.length) return;

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) return;

  const maxRotate = 6; // degrees
  const maxTranslate = 6; // px

  cards.forEach((card) => {
    card.style.transformPerspective = "800px";

    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;

      const nx = x / r.width - 0.5;  // -0.5..0.5
      const ny = y / r.height - 0.5; // -0.5..0.5

      const rotateX = -ny * maxRotate;
      const rotateY = nx * maxRotate;
      const translateY = -Math.abs(ny) * maxTranslate - 2;

      card.style.transform = `
        translateY(${translateY}px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
      `;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

// ------------------------------
// 8. Home-only scroll lag / parallax
// ------------------------------
function initHomeScrollEffects() {
  const body = document.body;
  if (!body || body.dataset.page !== "home") return;

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Keep mobile + reduced motion simple
  const isSmallScreen =
    window.matchMedia && window.matchMedia("(max-width: 700px)").matches;

  if (prefersReduced || isSmallScreen) return;

  const hero = document.querySelector(".hero");
  const sections = Array.from(document.querySelectorAll(".home-section"));

  const layers = [];

  if (hero) {
    layers.push({ el: hero, factor: 0.16 });
  }

  sections.forEach((el, index) => {
    layers.push({
      el,
      factor: 0.06 + index * 0.02, // slightly different lag per section
    });
  });

  if (!layers.length) return;

  let targetScroll = window.scrollY || 0;
  let currentScroll = targetScroll;
  let ticking = false;

  function update() {
    const lerpFactor = 0.14;
    currentScroll += (targetScroll - currentScroll) * lerpFactor;

    layers.forEach((layer) => {
      const offset = -currentScroll * layer.factor;
      layer.el.style.transform = `translateY(${offset}px)`;
    });

    if (Math.abs(targetScroll - currentScroll) > 0.5) {
      requestAnimationFrame(update);
    } else {
      ticking = false;
    }
  }

  function handleScroll() {
    targetScroll = window.scrollY || document.documentElement.scrollTop || 0;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  // Run once in case the page loads scrolled
  handleScroll();
}
