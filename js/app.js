// Year stamp
document.getElementById('y').textContent = new Date().getFullYear();

// Subtle parallax/glow on the orb (disabled for reduced-motion)
const orb = document.querySelector('.glass-orb');
const mediaReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
if (orb && !mediaReduced.matches) {
  window.addEventListener('scroll', () => {
    const y = Math.min(window.scrollY, 200);
    const translate = y * 0.06;          // gentle parallax
    const glow = Math.min(18 + y * 0.04, 28);
    orb.style.transform = `translateY(${translate}px)`;
    orb.style.boxShadow =
      `0 20px 60px rgba(17,17,20,.10),
       0 0 ${glow}px ${Math.max(glow-8,0)}px rgba(255,78,205,.15),
       inset 0 0 0 1px rgba(255,255,255,.55)`;
  }, { passive: true });
}