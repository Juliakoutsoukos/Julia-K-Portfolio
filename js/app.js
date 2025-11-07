// Year stamp (safe if #y isn't present)
const yEl = document.getElementById('y');
if (yEl) yEl.textContent = new Date().getFullYear();

// Interactive glass highlights + gentle parallax
const orb = document.querySelector('.glass-orb');
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (orb && !prefersReduced) {
  // Move highlight with mouse position over viewport (mapped to orb area)
  window.addEventListener('mousemove', (e) => {
    const rect = orb.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const x = (e.clientX - rect.left) / rect.width;  // 0..1
    const y = (e.clientY - rect.top)  / rect.height; // 0..1

    // clamp and map to pleasant ranges inside the orb
    const hx = Math.min(85, Math.max(15, 15 + x * 70));
    const hy = Math.min(80, Math.max(10, 10 + y * 70));
    const glow = 18 + (1 - y) * 14; // brighter when cursor is nearer the top

    orb.style.setProperty('--hx', hx.toFixed(2));
    orb.style.setProperty('--hy', hy.toFixed(2));
    orb.style.setProperty('--glow', `${glow.toFixed(0)}px`);
  }, { passive: true });

  // Gentle vertical parallax + glow modulation on scroll
  window.addEventListener('scroll', () => {
    const y = Math.min(window.scrollY, 240);
    const translate = y * 0.05;     // subtle parallax
    const glow = 20 + y * 0.03;     // subtle glow increase

    orb.style.transform = `translateY(${translate}px)`;
    orb.style.setProperty('--glow', `${glow.toFixed(0)}px`);
  }, { passive: true });
}