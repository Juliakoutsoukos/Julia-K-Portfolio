// ==============================
// Julia Portfolio — app.js
// Clean + organized
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  setYearStamp();
  initGlassOrb();
  initWorkReveal();
  initWorkFilters();   // safe even if you don't have filter buttons (yet)
  initContactForm();
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
//    - Highlight follows cursor
//    - Subtle 3D tilt
//    - Scroll parallax
//    Respects prefers-reduced-motion
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

  // Mouse highlight + rotation for 3D feel
  const handleMouseMove = (e) => {
    const r = orb.getBoundingClientRect();
    if (!r.width || !r.height) return;

    const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2); // -1..1
    const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2); // -1..1

    // Map to highlight centers (in % inside the orb)
    targetHX = 50 + nx * 25; // 25%..75%
    targetHY = 50 + ny * 25; // 25%..75%
    targetGlow = 22 + (1 - (ny + 1) / 2) * 12;

    // Tilt the orb toward the cursor
    rotY = nx * 6; // left/right tilt
    rotX = -ny * 6; // up/down tilt
  };

  window.addEventListener("mousemove", handleMouseMove, { passive: true });

  // Scroll parallax
  const handleScroll = () => {
    const y = Math.min(window.scrollY, 240);
    ty = y * 0.05;
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  // Smooth animation loop
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
//    - Fades / slides cards in as you scroll
// ------------------------------
function initWorkReveal() {
  const cards = document.querySelectorAll(".wcard");
  if (!cards.length) return;

  // Start hidden (you can refine with CSS)
  cards.forEach((card) => {
    card.classList.add("wcard--hidden");
  });

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    // If user prefers less motion, just show them
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
//    You don't currently have .filter buttons,
//    but this will start working the second you add them.
// ------------------------------
function initWorkFilters() {
  const filters = document.querySelectorAll(".filter");
  const cards = document.querySelectorAll(".wcard");

  if (!filters.length || !cards.length) return;

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      // active state styling
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
// 5. Contact form helpers
//    - character counter
//    - basic validation
// ------------------------------
function initContactForm() {
  const form = document.querySelector('form[name="contact"]');
  if (!form) return;

  const email = form.querySelector("#email");
  const nameEl = form.querySelector("#name");
  const msg = form.querySelector("#message");
  const consent = form.querySelector("#consent");
  const errors = form.querySelector("#form-errors");
  const counter = form.querySelector("#msg-count");

  // Live character counter
  if (msg && counter) {
    const updateCount = () => {
      counter.textContent = `${msg.value.length} / ${msg.maxLength}`;
    };
    msg.addEventListener("input", updateCount);
    updateCount();
  }

  form.addEventListener("submit", (e) => {
    if (!errors) return;

    errors.textContent = "";

    const issues = [];

    if (!nameEl || !nameEl.value.trim()) {
      issues.push("Please enter your name.");
    }
    if (
      !email ||
      !email.value.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
    ) {
      issues.push("Please enter a valid email.");
    }
    if (!msg || !msg.value.trim()) {
      issues.push("Please add a short message.");
    }
    if (!consent || !consent.checked) {
      issues.push("Please confirm you’re okay with being contacted.");
    }

    if (issues.length) {
      e.preventDefault();
      errors.textContent = issues.join(" ");

      // Focus the first invalid field
      if (!nameEl || !nameEl.value.trim()) {
        nameEl && nameEl.focus();
      } else if (!email || !email.value.trim()) {
        email && email.focus();
      } else if (!msg || !msg.value.trim()) {
        msg && msg.focus();
      } else if (!consent || !consent.checked) {
        consent && consent.focus();
      }
    }
  });
}