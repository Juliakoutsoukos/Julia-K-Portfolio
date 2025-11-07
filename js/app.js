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