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

// =====================================================
// Scroll: feed --scroll-y to CSS + toggle is-scrolled class on body
// (drives photo parallax, header hide, and rail reveal)
// =====================================================
(() => {
  const root = document.documentElement;
  const body = document.body;
  const SCROLL_THRESHOLD = 100;
  let raf = null;

  const update = () => {
    raf = null;
    const y = window.scrollY;
    root.style.setProperty('--scroll-y', y);
    body.classList.toggle('is-scrolled', y > SCROLL_THRESHOLD);
  };

  const onScroll = () => {
    if (raf === null) raf = requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  update();
})();

// =====================================================
// Active section in scroll rail (IntersectionObserver)
// =====================================================
(() => {
  const railItems = document.querySelectorAll('.rail-item');
  if (!railItems.length) return;

  const sections = document.querySelectorAll('main section[id]');
  if (!sections.length) return;

  const setActive = (id) => {
    railItems.forEach((item) => {
      item.classList.toggle('is-active', item.dataset.section === id);
    });
  };

  // Track each section's intersection ratio; the one most "in view" wins
  const ratios = new Map();

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => ratios.set(e.target.id, e.intersectionRatio));
      let topId = null;
      let topRatio = 0;
      ratios.forEach((r, id) => {
        if (r > topRatio) { topRatio = r; topId = id; }
      });
      if (topId && topRatio > 0) setActive(topId);
    },
    {
      threshold: [0, 0.15, 0.3, 0.5, 0.75, 1],
      rootMargin: '-15% 0px -45% 0px',
    }
  );

  sections.forEach((s) => obs.observe(s));
})();

// Smooth-scroll for in-page anchor links
(() => {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = href === '#top' ? document.body : document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

// Footer year
(() => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
