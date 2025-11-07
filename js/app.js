// Year stamp (safe if #y isn't present)
const yEl = document.getElementById('y');
if (yEl) yEl.textContent = new Date().getFullYear();

const orb = document.querySelector('.glass-orb');
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (orb && !prefersReduced) {
  let targetHX = 30, targetHY = 25, targetGlow = 24;
  let rotX = 0, rotY = 0, ty = 0;
  let curHX = targetHX, curHY = targetHY, curGlow = targetGlow, curRotX = 0, curRotY = 0, curTY = 0;

  const lerp = (a,b,t) => a + (b-a)*t;

  // Mouse highlight + rotation for 3D feel
  window.addEventListener('mousemove', (e) => {
    const r = orb.getBoundingClientRect();
    if (!r.width || !r.height) return;

    const nx = (e.clientX - (r.left + r.width/2)) / (r.width/2);   // -1..1
    const ny = (e.clientY - (r.top  + r.height/2)) / (r.height/2); // -1..1

    // Map to highlight centers (in % inside the orb)
    targetHX = 50 + nx * 25; // 25%..75%
    targetHY = 50 + ny * 25; // 25%..75%
    targetGlow = 22 + (1 - (ny+1)/2) * 12;

    // Tilt the orb toward the cursor
    rotY = nx * 6;   // left/right tilt
    rotX = -ny * 6;  // up/down tilt
  }, { passive:true });

  // Scroll parallax
  window.addEventListener('scroll', () => {
    const y = Math.min(window.scrollY, 240);
    ty = y * 0.05;
  }, { passive:true });

  // Smooth animation loop
  function tick(){
    curHX   = lerp(curHX,   targetHX, 0.12);
    curHY   = lerp(curHY,   targetHY, 0.12);
    curGlow = lerp(curGlow, targetGlow, 0.10);
    curRotX = lerp(curRotX, rotX, 0.10);
    curRotY = lerp(curRotY, rotY, 0.10);
    curTY   = lerp(curTY,   ty,   0.10);

    orb.style.setProperty('--hx', curHX.toFixed(2));
    orb.style.setProperty('--hy', curHY.toFixed(2));
    orb.style.setProperty('--glow', `${curGlow.toFixed(0)}px`);
    orb.style.transform = `translateY(${curTY}px) rotateX(${curRotX}deg) rotateY(${curRotY}deg)`;

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
// Year (already in your file)
const yEl = document.getElementById('y');
if (yEl) yEl.textContent = new Date().getFullYear();

// Simple Work page filters
const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.wcard');

if (filters.length) {
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      // active state
      filters.forEach(b => { b.classList.toggle('is-active', b === btn); });
      const sel = btn.dataset.filter;

      cards.forEach(card => {
        if (sel === 'all') { card.style.display = ''; return; }
        const cats = (card.dataset.cat || '').split(' ');
        card.style.display = cats.includes(sel) ? '' : 'none';
      });
    });
  });
}
// Year stamp (already present in your file)
const yEl = document.getElementById('y');
if (yEl) yEl.textContent = new Date().getFullYear();

// Contact form helpers
const form = document.querySelector('form[name="contact"]');
if (form) {
  const email = form.querySelector('#email');
  const nameEl = form.querySelector('#name');
  const msg = form.querySelector('#message');
  const consent = form.querySelector('#consent');
  const errors = form.querySelector('#form-errors');
  const counter = form.querySelector('#msg-count');

  // live character counter
  if (msg && counter) {
    const updateCount = () => { counter.textContent = `${msg.value.length} / ${msg.maxLength}`; };
    msg.addEventListener('input', updateCount);
    updateCount();
  }

  form.addEventListener('submit', (e) => {
    errors.textContent = '';

    // simple checks
    const issues = [];
    if (!nameEl.value.trim()) issues.push('Please enter your name.');
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) issues.push('Please enter a valid email.');
    if (!msg.value.trim()) issues.push('Please add a short message.');
    if (!consent.checked) issues.push('Please confirm you’re okay with being contacted.');

    if (issues.length) {
      e.preventDefault();
      errors.textContent = issues.join(' ');
      // focus the first invalid field
      ( !nameEl.value.trim() ? nameEl : !email.value.trim() ? email : !msg.value.trim() ? msg : consent ).focus();
    }
  });
}