// ============================================
// APP LOGIC
// ============================================

(function () {
  'use strict';

  // ---------- HELPERS ----------
  const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = (value) => String(value == null ? '' : value).replace(/[&<>"']/g, (ch) => ESCAPES[ch]);
  const qs = (selector, root) => (root || document).querySelector(selector);
  const qsa = (selector, root) => Array.prototype.slice.call((root || document).querySelectorAll(selector));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const NAV_SCROLL_OFFSET = 100;
  const ANCHOR_SCROLL_OFFSET = 80;

  // ---------- DATA ----------
  function loadData() {
    try {
      const saved = localStorage.getItem('portfolioData');
      if (saved) Object.assign(portfolioData, JSON.parse(saved));
    } catch (e) {
      console.warn('Could not load saved data', e);
    }
  }

  function saveData() {
    try {
      localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
    } catch (e) {
      console.warn('Could not save data', e);
    }
  }

  function init() {
    loadData();
    renderAll();
    initTheme();
    initEditMode();
    initContactForm();
    initMobileMenu();
    initScrollAnimations();
    initScrollUpdates();
    initSmoothAnchors();
    initParallax();
    startTyping();
  }

  // ---------- RENDER ----------
  function renderAll() {
    renderHero();
    renderAbout();
    renderSkills();
    renderExperience();
    renderProjects();
    renderContact();
  }

  // ---------- HERO ----------
  function renderHero() {
    const p = portfolioData.personal;
    document.getElementById('hero-name').textContent = p.name;
    document.getElementById('hero-subtitle').textContent = p.subtitle;
    document.getElementById('logo-name').textContent = p.name.split(' ')[0] || p.name;
    // Title itself is rendered by the typing effect
  }

  // ---------- ABOUT ----------
  function renderAbout() {
    const p = portfolioData.personal;
    document.getElementById('about-text').textContent = p.about;
    document.getElementById('info-email').textContent = p.email;
    document.getElementById('info-phone').textContent = p.phone;
    document.getElementById('info-location').textContent = p.location;
    document.getElementById('info-telegram').textContent = p.telegram;
  }

  // ---------- SKILLS ----------
  function renderSkills() {
    const container = document.getElementById('skills-grid');
    container.innerHTML = portfolioData.skills.map((skill) => {
      const level = Math.min(100, Math.max(0, Number(skill.level) || 0));
      return `
        <div class="skill-card reveal-scale">
          <div class="skill-header">
            <span class="skill-name">${esc(skill.name)}</span>
            <span class="skill-level">${level}%</span>
          </div>
          <div class="skill-bar">
            <div class="skill-progress" style="--target-width: ${level}%"></div>
          </div>
          <div class="skill-category">${esc(skill.category)}</div>
        </div>
      `;
    }).join('');
  }

  // ---------- EXPERIENCE ----------
  function renderExperience() {
    const container = document.getElementById('experience-list');
    container.innerHTML = portfolioData.experience.map((exp) => `
      <div class="exp-card reveal">
        <div class="exp-header">
          <div class="exp-company">${esc(exp.company)}</div>
          <div class="exp-period">${esc(exp.period)}</div>
        </div>
        <div class="exp-position">${esc(exp.position)}</div>
        <p class="exp-desc">${esc(exp.description)}</p>
        <ul class="exp-achievements">
          ${exp.achievements.map((a) => `<li>${esc(a)}</li>`).join('')}
        </ul>
      </div>
    `).join('');
  }

  // ---------- PROJECTS ----------
  function renderProjects() {
    const container = document.getElementById('projects-grid');
    container.innerHTML = portfolioData.projects.map((proj) => `
      <article class="project-card reveal-scale">
        <div class="project-image">
          <img src="${esc(proj.image)}" alt="${esc(proj.title)}" width="600" height="400" loading="lazy" decoding="async">
        </div>
        <div class="project-body">
          <h3 class="project-title">${esc(proj.title)}</h3>
          <p class="project-desc">${esc(proj.description)}</p>
          <div class="project-tags">
            ${proj.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}
          </div>
        </div>
      </article>
    `).join('');
  }

  // ---------- CONTACT ----------
  function renderContact() {
    const p = portfolioData.personal;
    document.getElementById('contact-email').textContent = p.email;
    document.getElementById('contact-phone').textContent = p.phone;
    document.getElementById('contact-location').textContent = p.location;
    document.getElementById('contact-telegram').textContent = p.telegram;
  }

  // ---------- THEME ----------
  let themeButtons = [];

  function initTheme() {
    themeButtons = qsa('[data-set-theme]');

    let saved = 'dark';
    try {
      saved = localStorage.getItem('portfolioTheme') || 'dark';
    } catch (e) { /* storage unavailable */ }
    setTheme(saved);

    themeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        setTheme(btn.dataset.setTheme);
        try {
          localStorage.setItem('portfolioTheme', btn.dataset.setTheme);
        } catch (e) { /* storage unavailable */ }
      });
    });
  }

  function setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    themeButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.setTheme === theme);
    });

    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      const colors = { dark: '#0f0f12', light: '#f8f9fc', vibrant: '#0d0b1a' };
      themeColorMeta.setAttribute('content', colors[theme] || colors.dark);
    }
  }

  // ---------- SCROLL STATE (header + nav + parallax in one rAF loop) ----------
  let headerEl = null;
  let navLinks = [];
  let sections = [];
  let sectionTops = [];
  let currentSectionId = null;
  let scrollFrameRequested = false;

  let layers = [];
  let mouseX = 0;
  let mouseY = 0;

  function measureSections() {
    sectionTops = sections.map((section) => ({
      id: section.id,
      top: section.getBoundingClientRect().top + window.scrollY
    }));
  }

  function updateActiveNav(scrollY) {
    let current = '';
    for (let i = 0; i < sectionTops.length; i++) {
      if (scrollY >= sectionTops[i].top - NAV_SCROLL_OFFSET) current = sectionTops[i].id;
    }
    if (current === currentSectionId) return;
    currentSectionId = current;

    const hash = '#' + current;
    navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === hash));
  }

  function updateParallax(scrollY) {
    if (!layers.length || reducedMotion.matches || scrollY > window.innerHeight) return;
    layers.forEach((layer) => {
      const speed = parseFloat(layer.dataset.speed) || 0.1;
      const x = mouseX * 60 * speed;
      const y = mouseY * 40 * speed + scrollY * speed * 0.5;
      layer.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  function applyScrollState() {
    scrollFrameRequested = false;
    const scrollY = window.scrollY;
    headerEl.classList.toggle('scrolled', scrollY > 40);
    updateActiveNav(scrollY);
    updateParallax(scrollY);
  }

  function scheduleScrollState() {
    if (scrollFrameRequested) return;
    scrollFrameRequested = true;
    requestAnimationFrame(applyScrollState);
  }

  function initScrollUpdates() {
    headerEl = qs('.header');
    navLinks = qsa('.nav a, .mobile-nav a');
    sections = qsa('section[id]');
    layers = qsa('.parallax-layer');
    measureSections();

    window.addEventListener('scroll', scheduleScrollState, { passive: true });

    // Layout can shift after load (webfonts) or on resize — keep section offsets fresh
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        measureSections();
        scheduleScrollState();
      }, 150);
    });
    window.addEventListener('load', () => {
      measureSections();
      scheduleScrollState();
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        measureSections();
        scheduleScrollState();
      });
    }

    scheduleScrollState();
  }

  // ---------- PARALLAX (mouse) ----------
  function initParallax() {
    const hero = qs('.hero');
    if (!hero || !layers.length || reducedMotion.matches) return;

    hero.addEventListener('mousemove', (event) => {
      const rect = hero.getBoundingClientRect();
      mouseX = (event.clientX - rect.left) / rect.width - 0.5;
      mouseY = (event.clientY - rect.top) / rect.height - 0.5;
      scheduleScrollState();
    });

    hero.addEventListener('mouseleave', () => {
      mouseX = 0;
      mouseY = 0;
      layers.forEach((layer) => {
        layer.style.transition = 'transform 0.6s ease';
      });
      scheduleScrollState();
      setTimeout(() => {
        layers.forEach((layer) => {
          layer.style.transition = '';
        });
      }, 600);
    });
  }

  // ---------- NAV HIGHLIGHT + ANCHOR SCROLL (event delegation) ----------
  function initSmoothAnchors() {
    document.addEventListener('click', (event) => {
      const target = event.target;
      const link = target && target.closest ? target.closest('a[href^="#"]') : null;
      if (!link) return;

      const id = link.getAttribute('href');
      if (!id || id === '#') return;

      let section = null;
      try {
        section = document.querySelector(id);
      } catch (e) {
        return; // malformed selector — let the browser handle it
      }
      if (!section) return;

      event.preventDefault();
      const top = section.getBoundingClientRect().top + window.scrollY - ANCHOR_SCROLL_OFFSET;
      window.scrollTo({ top, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      closeMobileMenu();
    });
  }

  // ---------- EDIT MODE ----------
  const EDITABLE_IDS = [
    'hero-name', 'hero-subtitle', 'about-text',
    'info-email', 'info-phone', 'info-location', 'info-telegram',
    'contact-email', 'contact-phone', 'contact-location', 'contact-telegram',
    'typed-text'
  ];

  function initEditMode() {
    const btn = document.getElementById('edit-btn');

    btn.addEventListener('click', () => {
      const entering = document.body.classList.toggle('edit-mode');
      btn.classList.toggle('active', entering);
      btn.textContent = entering ? 'Сохранить' : 'Редактировать';

      if (entering) {
        enableEditing();
      } else {
        saveEdits();
        disableEditing();
        startTyping();
      }
    });
  }

  function enableEditing() {
    stopTyping();

    // Show the full title so it can be edited as plain text
    const typed = document.getElementById('typed-text');
    if (typed) typed.textContent = portfolioData.personal.title;

    EDITABLE_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.contentEditable = 'true';
    });
  }

  function disableEditing() {
    qsa('[contenteditable]').forEach((el) => {
      el.contentEditable = 'false';
    });
  }

  function readText(id) {
    const el = document.getElementById(id);
    return el ? el.textContent.trim() : '';
  }

  // The same value is shown in two blocks (About + Contacts); accept the edit
  // from whichever block the visitor actually changed.
  function readField(primaryId, secondaryId, current) {
    const primary = readText(primaryId);
    const secondary = secondaryId ? readText(secondaryId) : '';
    if (primary && primary !== current) return primary;
    if (secondary && secondary !== current) return secondary;
    return primary || current;
  }

  function saveEdits() {
    const p = portfolioData.personal;

    p.name = readText('hero-name') || p.name;
    p.title = readText('typed-text') || p.title;
    p.subtitle = readText('hero-subtitle') || p.subtitle;
    p.about = readText('about-text') || p.about;
    p.email = readField('info-email', 'contact-email', p.email);
    p.phone = readField('info-phone', 'contact-phone', p.phone);
    p.location = readField('info-location', 'contact-location', p.location);
    p.telegram = readField('info-telegram', 'contact-telegram', p.telegram);

    saveData();
    renderHero();
    renderAbout();
    renderContact();
    measureSections();
    showToast('Изменения сохранены!');
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'edit-hint toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  }

  // ---------- CONTACT FORM ----------
  function initContactForm() {
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = form.elements.name ? form.elements.name.value : '';
      showToast(`Спасибо, ${name}! Сообщение отправлено (демо).`);
      form.reset();
    });
  }

  // ---------- MOBILE MENU ----------
  function closeMobileMenu() {
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNav) mobileNav.classList.remove('open');
  }

  function initMobileMenu() {
    const burger = document.getElementById('burger');
    const mobileNav = document.getElementById('mobile-nav');

    burger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
    // Links are handled by the delegated anchor handler, which closes the menu
  }

  // ---------- SCROLL ANIMATIONS ----------
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -60px 0px'
    });

    // className is omitted for elements that already carry their reveal class
    // in the render template; stagger sets the --stagger entrance delay.
    function observe(selector, className, stagger) {
      qsa(selector).forEach((el, i) => {
        if (className) el.classList.add(className);
        if (stagger) el.style.setProperty('--stagger', `${i * stagger}s`);
        observer.observe(el);
      });
    }

    observe('.section-title', 'reveal');
    observe('.section-subtitle', 'reveal');
    observe('.about-text', 'reveal-left');
    observe('.info-item', 'reveal-right', 0.1);
    observe('.skill-card', null, 0.05);
    observe('.exp-card', null, 0.12);
    observe('.project-card', null, 0.05);
    observe('.contact-info .contact-item', 'reveal-left', 0.1);
    observe('.contact-form', 'reveal-right');
  }

  // ---------- TYPING EFFECT ----------
  let typingTimer = null;

  function stopTyping() {
    if (typingTimer) {
      clearTimeout(typingTimer);
      typingTimer = null;
    }
  }

  function startTyping() {
    const el = document.getElementById('typed-text');
    if (!el) return;

    stopTyping();

    const phrases = [
      portfolioData.personal.title,
      'Создаю красивые интерфейсы',
      'Пишу чистый и быстрый код',
      'Frontend + UI/UX'
    ];

    if (reducedMotion.matches) {
      el.textContent = phrases[0];
      return;
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const current = phrases[phraseIndex];

      if (isDeleting) {
        charIndex -= 1;
        el.textContent = current.slice(0, charIndex);
      } else {
        charIndex += 1;
        el.textContent = current.slice(0, charIndex);
      }

      let delay = isDeleting ? 35 : 70;

      if (!isDeleting && charIndex === current.length) {
        delay = 2000; // pause at the end of the phrase
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 400;
      }

      typingTimer = setTimeout(type, delay);
    }

    // Start after a short delay so hero animations can play
    typingTimer = setTimeout(type, 900);
  }

  // ---------- BOOT ----------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
