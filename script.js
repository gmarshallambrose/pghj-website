// Page-wide cursor glow — smooth follow with rAF
(() => {
  const glow = document.querySelector('.cursor-glow');
  if (!glow) return;

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;

  const onMove = (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  };

  const tick = () => {
    // Lerp for buttery follow
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    glow.style.setProperty('--mx', currentX + 'px');
    glow.style.setProperty('--my', currentY + 'px');
    requestAnimationFrame(tick);
  };

  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('mouseleave', () => glow.style.opacity = '0');
  window.addEventListener('mouseenter', () => glow.style.opacity = '1');
  tick();
})();

// Per-card spotlight tracking
(() => {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--card-mx', x + 'px');
      card.style.setProperty('--card-my', y + 'px');
    });
  });
})();

// Subtle 3D tilt on cards (very small — keeps it professional, not gimmicky)
(() => {
  const cards = document.querySelectorAll('.card');
  const MAX_TILT = 4; // degrees

  cards.forEach((card) => {
    let raf = null;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const x = e.clientX - rect.left - cx;
      const y = e.clientY - rect.top - cy;
      const rx = (-y / cy) * MAX_TILT;
      const ry = (x / cx) * MAX_TILT;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `translateY(-3px) perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
    });

    card.addEventListener('mouseleave', () => {
      cancelAnimationFrame(raf);
      card.style.transform = '';
    });
  });
})();

// Footer year
(() => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
