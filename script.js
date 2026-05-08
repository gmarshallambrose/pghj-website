// =====================================================
// Cursor: soft red halo (lerped) + precise red dot (instant)
// =====================================================
(() => {
  const glow = document.querySelector('.cursor-glow');
  const dot  = document.querySelector('.cursor-dot');
  if (!glow || !dot) return;

  document.body.classList.add('cursor-active');

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  const glowPos = { x: mx, y: my };

  const onMove = (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.setProperty('--dx', mx + 'px');
    dot.style.setProperty('--dy', my + 'px');
  };

  const onLeave = () => { glow.style.opacity = '0'; dot.style.opacity = '0'; };
  const onEnter = () => { glow.style.opacity = '1'; dot.style.opacity = '1'; };

  window.addEventListener('mousemove', onMove, { passive: true });
  document.addEventListener('mouseleave', onLeave);
  document.addEventListener('mouseenter', onEnter);

  const lerp = (a, b, t) => a + (b - a) * t;

  const tick = () => {
    glowPos.x = lerp(glowPos.x, mx, 0.10);
    glowPos.y = lerp(glowPos.y, my, 0.10);
    glow.style.setProperty('--mx', glowPos.x + 'px');
    glow.style.setProperty('--my', glowPos.y + 'px');
    requestAnimationFrame(tick);
  };
  tick();
})();

// =====================================================
// Per-card spotlight (radial highlight tracks cursor inside card)
// =====================================================
(() => {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--card-mx', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--card-my', (e.clientY - rect.top) + 'px');
    });
  });
})();

// Footer year
(() => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
