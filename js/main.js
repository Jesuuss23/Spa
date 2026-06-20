/**
 * ROSSIE SALOON SPA — main.js
 * Scroll reveals · Header shrink · Mobile nav · Parallax · Tema oscuro · Flip automático
 */

(function () {
  'use strict';

  /* ── 1. HEADER y HAMBURGER ──────────────────────────────────── */
  const header     = document.querySelector('.main-header');
  const hamburger  = document.querySelector('.hamburger');
  const navMenu    = document.querySelector('.nav-menu');
  const navLinks   = document.querySelectorAll('.nav-menu a');

  if (!hamburger && header) {
    const btn = document.createElement('button');
    btn.className = 'hamburger';
    btn.setAttribute('aria-label', 'Menú');
    btn.innerHTML = '<span></span><span></span><span></span>';
    header.querySelector('.header-container').appendChild(btn);

    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        btn.classList.remove('active');
        navMenu.classList.remove('open');
      });
    });
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  /* ── 2. REVEAL ON SCROLL ────────────────────────────────────── */
  function addRevealClasses() {
    const targets = [
      { sel: '.card-destacado',   delays: true },
      { sel: '.card-service',     delays: true },
      { sel: '.card-flip',        delays: true },
      { sel: '.card-product',     delays: true },
      { sel: '.section-title',    delays: false },
      { sel: '.section-title-alt',delays: false },
      { sel: '.section-subtitle', delays: false },
      { sel: '.category-title',   delays: false },
      { sel: '.subcategory h4',   delays: false },
      { sel: '.brand-intro',      delays: false },
      { sel: '.contact-info-block', delays: false },
      { sel: '.contact-buttons-block', delays: false },
    ];

    targets.forEach(({ sel, delays }) => {
      document.querySelectorAll(sel).forEach((el, i) => {
        el.classList.add('reveal');
        if (delays && i < 4) {
          el.classList.add(`reveal-delay-${i + 1}`);
        }
      });
    });
  }

  function initReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  /* ── 3. HERO PARALLAX ───────────────────────────────────────── */
  function initParallax() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const limit   = heroSection.offsetHeight;
      if (scrollY > limit) return;

      heroSection.style.setProperty('--parallax-y', `${scrollY * 0.35}px`);
    }, { passive: true });

    const style = document.createElement('style');
    style.textContent = `.hero-section::before { transform: translate(var(--parallax-y, 0), calc(var(--parallax-y, 0) * -0.5)); }`;
    document.head.appendChild(style);
  }

  /* ── 4. ACTIVE NAV ──────────────────────────────────────────── */
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-menu a[href^="#"]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${id}`) {
              link.style.color = 'var(--color-primario)';
            }
          });
        }
      });
    }, { threshold: 0.45 });

    sections.forEach(s => observer.observe(s));
  }

  /* ── 5. CARD TILT ───────────────────────────────────────────── */
  function initTilt() {
    if (window.matchMedia('(hover: none)').matches) return;

    document.querySelectorAll('.card-product, .card-destacado, .card-flip').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect   = card.getBoundingClientRect();
        const cx     = rect.left + rect.width  / 2;
        const cy     = rect.top  + rect.height / 2;
        const dx     = (e.clientX - cx) / (rect.width  / 2);
        const dy     = (e.clientY - cy) / (rect.height / 2);
        const tiltX  = (dy * -6).toFixed(2);
        const tiltY  = (dx *  6).toFixed(2);

        card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-5px)`;
        card.style.transition = 'transform 0.1s ease';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      });
    });
  }

  /* ── 6. SMOOTH SCROLL ───────────────────────────────────────── */
  function initSmoothScroll() {
    const headerH = 72;
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ── 7. FLOATING BUTTONS ────────────────────────────────────── */
  function initFloatingButtons() {
    const container = document.querySelector('.floating-buttons-container');
    if (!container) return;

    container.style.opacity    = '0';
    container.style.transform  = 'translateY(20px)';
    container.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

    setTimeout(() => {
      container.style.opacity   = '1';
      container.style.transform = 'translateY(0)';
    }, 1500);
  }

  /* ── 8. IMAGE FALLBACK ──────────────────────────────────────── */
  function initImageFallbacks() {
    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', function () {
        const parent = this.parentElement;
        this.style.display = 'none';

        if (!parent.querySelector('.img-placeholder')) {
          const ph = document.createElement('div');
          ph.className = 'img-placeholder';
          ph.style.cssText = `
            width: 100%;
            height: 100%;
            min-height: 180px;
            background: linear-gradient(135deg, #b8eaf4 0%, #f7e49e 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: rgba(28,26,24,0.35);
            font-family: 'Cormorant Garamond', serif;
            font-size: 2rem;
            letter-spacing: 0.1em;
          `;
          ph.textContent = '✦';
          parent.appendChild(ph);
        }
      });
    });
  }

  /* ── 9. HERO SHIMMER ────────────────────────────────────────── */
  function initHeroShimmer() {
    const h1 = document.querySelector('.hero-content h1');
    if (!h1 || h1.querySelector('span')) return;

    h1.innerHTML = h1.textContent
      .replace('Rossie', '<span>Rossie</span>');
  }

  /* ── 10. CUSTOM CURSOR ─────────────────────────────────────── */
  function initCustomCursor() {
    if (window.matchMedia('(hover: none)').matches) return;

    const cursor = document.createElement('div');
    cursor.id = 'rossie-cursor';
    cursor.style.cssText = `
      position: fixed;
      width: 10px; height: 10px;
      border-radius: 50%;
      background: linear-gradient(135deg,#d4a373,#c9956a);
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%,-50%);
      transition: width 0.25s ease, height 0.25s ease, opacity 0.25s ease;
      mix-blend-mode: multiply;
      opacity: 0;
    `;

    const ring = document.createElement('div');
    ring.id = 'rossie-cursor-ring';
    ring.style.cssText = `
      position: fixed;
      width: 36px; height: 36px;
      border-radius: 50%;
      border: 1.5px solid rgba(212,163,115,0.6);
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%,-50%);
      transition: width 0.35s ease, height 0.35s ease, border-color 0.35s ease;
      opacity: 0;
    `;

    document.body.appendChild(cursor);
    document.body.appendChild(ring);

    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.opacity = '1';
      ring.style.opacity   = '1';
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });

    function followRing() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(followRing);
    }
    followRing();

    document.querySelectorAll('a, button, .card-service, .card-product, .card-destacado, .card-flip').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width  = '16px';
        cursor.style.height = '16px';
        ring.style.width    = '56px';
        ring.style.height   = '56px';
        ring.style.borderColor = 'rgba(232,200,74,0.7)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width  = '10px';
        cursor.style.height = '10px';
        ring.style.width    = '36px';
        ring.style.height   = '36px';
        ring.style.borderColor = 'rgba(212,163,115,0.6)';
      });
    });
  }

function initFlipCards() {
  const destacados = document.querySelectorAll('.card-destacado');
  destacados.forEach((card) => {
    setInterval(() => {
      card.classList.toggle('flipped');
    }, 10000);  
  });

  const serviciosFlip = document.querySelectorAll('.card-flip');
  serviciosFlip.forEach((card) => {
    setInterval(() => {
      card.classList.toggle('flipped');
    }, 5000);    
  });
}

  /* ── 12. TEMA OSCURO (Toggle) ───────────────────────────────── */
  function initThemeToggle() {
    const toggleBtn = document.getElementById('themeToggle');
    if (!toggleBtn) return;

    // Verificar preferencia guardada
    const savedTheme = localStorage.getItem('rossie-theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      toggleBtn.textContent = '☀️';
    }

    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      const isDark = document.body.classList.contains('dark-theme');
      toggleBtn.textContent = isDark ? '☀️' : '🌙';
      localStorage.setItem('rossie-theme', isDark ? 'dark' : 'light');
    });
  }

  /* ── 13. ACCORDION (opcional) ───────────────────────────────── */
  function initServiceAccordion() {
    const toggleBtns = document.querySelectorAll('.toggle-details-btn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.card-service');
        if (card) {
          card.classList.toggle('active');
        }
      });
    });
  }

  /* ── INIT ────────────────────────────────────────────────────── */
  function init() {
    addRevealClasses();
    initReveal();
    initParallax();
    initActiveNav();
    initTilt();
    initSmoothScroll();
    initFloatingButtons();
    initImageFallbacks();
    initHeroShimmer();
    initCustomCursor();
    initFlipCards();
    initThemeToggle();      // Nuevo: Toggle de tema oscuro
    initServiceAccordion();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();