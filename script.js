// =====================================================
// Custom cursor system: glow + ring + dot, with magnetize
// =====================================================
(() => {
  const glow = document.querySelector('.cursor-glow');
  const ring = document.querySelector('.cursor-ring');
  const dot  = document.querySelector('.cursor-dot');
  if (!glow || !ring || !dot) return;

  // Hide native cursor only when JS is active
  document.body.classList.add('cursor-active');

  // Cursor target (where mouse actually is)
  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;

  // Magnetize target — when hovering an interactive, ring eases toward its center
  let magnetTarget = null;

  // Lerped positions for each layer (different speeds = parallax feel)
  const glowPos = { x: mx, y: my };
  const ringPos = { x: mx, y: my };

  const onMove = (e) => {
    mx = e.clientX;
    my = e.clientY;
    // Dot is ~instant — set directly each frame
    dot.style.setProperty('--dx', mx + 'px');
    dot.style.setProperty('--dy', my + 'px');
  };

  const onDown = () => ring.classList.add('is-down');
  const onUp   = () => ring.classList.remove('is-down');

  const onLeave = () => {
    glow.style.opacity = '0';
    ring.style.opacity = '0';
    dot.style.opacity = '0';
  };
  const onEnter = () => {
    glow.style.opacity = '1';
    ring.style.opacity = '1';
    dot.style.opacity = '1';
  };

  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('mousedown', onDown);
  window.addEventListener('mouseup',   onUp);
  document.addEventListener('mouseleave', onLeave);
  document.addEventListener('mouseenter', onEnter);

  // Magnetize ring on hover for these selectors
  const magneticSelectors = '.card, .about-link, .contact-email, .site-nav a';
  document.querySelectorAll(magneticSelectors).forEach((el) => {
    el.addEventListener('mouseenter', () => {
      magnetTarget = el;
      ring.classList.add('is-hover');
      dot.classList.add('is-hover');
    });
    el.addEventListener('mouseleave', () => {
      magnetTarget = null;
      ring.classList.remove('is-hover');
      dot.classList.remove('is-hover');
    });
  });

  const lerp = (a, b, t) => a + (b - a) * t;

  const tick = () => {
    // Glow follows slowly for a soft trailing halo
    glowPos.x = lerp(glowPos.x, mx, 0.10);
    glowPos.y = lerp(glowPos.y, my, 0.10);
    glow.style.setProperty('--mx', glowPos.x + 'px');
    glow.style.setProperty('--my', glowPos.y + 'px');

    // Ring magnetizes toward target center when hovering one
    let targetX = mx;
    let targetY = my;
    if (magnetTarget) {
      const r = magnetTarget.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top  + r.height / 2;
      // Pull ~55% toward center, keep ~45% cursor influence — feels intelligent, not glued
      targetX = lerp(mx, cx, 0.55);
      targetY = lerp(my, cy, 0.55);
    }
    ringPos.x = lerp(ringPos.x, targetX, 0.22);
    ringPos.y = lerp(ringPos.y, targetY, 0.22);
    ring.style.setProperty('--rx', ringPos.x + 'px');
    ring.style.setProperty('--ry', ringPos.y + 'px');

    requestAnimationFrame(tick);
  };
  tick();
})();

// =====================================================
// Per-card spotlight tracking (existing radial highlight)
// =====================================================
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

// =====================================================
// Subtle 3D tilt on cards
// =====================================================
(() => {
  const cards = document.querySelectorAll('.card');
  const MAX_TILT = 4;

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
