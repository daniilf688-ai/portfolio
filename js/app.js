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
      return true;
    } catch (e) {
      console.warn('Could not save data', e);
      return false;
    }
  }

  function init() {
    loadData();
    renderAll();
    initTheme();
    initEditMode();
    initProjectImageEdit();
    initAddSkill();
    initAddHobby();
    initAddExp();
    initAddProject();
    initDeleteCards();
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
    renderHobbies();
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
  function skillCardHtml(skill, index) {
    const level = Math.min(100, Math.max(0, Number(skill.level) || 0));
    return `
      <div class="skill-card reveal-scale" data-index="${index}">
        <button type="button" class="delete-card-btn" data-scope="skills" data-index="${index}" title="Удалить навык" aria-label="Удалить навык">✕</button>
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
  }

  function renderSkills() {
    const container = document.getElementById('skills-grid');
    container.innerHTML = portfolioData.skills.map(skillCardHtml).join('');
  }

  // ---------- EXPERIENCE ----------
  function expCardHtml(exp, index) {
    return `
      <div class="exp-card reveal" data-index="${index}">
        <button type="button" class="delete-card-btn" data-scope="exp" data-index="${index}" title="Удалить запись" aria-label="Удалить запись">✕</button>
        <div class="exp-media${exp.image ? ' has-image' : ''}">
          ${exp.image ? `<img src="${esc(exp.image)}" alt="${esc(exp.company)}" width="600" height="400" loading="lazy" decoding="async">` : ''}
          <button type="button" class="image-edit-btn" data-scope="exp" data-index="${index}">${exp.image ? 'Заменить фото' : 'Добавить фото'}</button>
        </div>
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
    `;
  }

  function renderExperience() {
    const container = document.getElementById('experience-list');
    container.innerHTML = portfolioData.experience.map(expCardHtml).join('');
  }

  // ---------- PROJECTS ----------
  function renderProjects() {
    const container = document.getElementById('projects-grid');
    container.innerHTML = portfolioData.projects.map((proj, index) => `
      <article class="project-card reveal-scale" data-index="${index}">
        <button type="button" class="delete-card-btn" data-scope="projects" data-index="${index}" title="Удалить проект" aria-label="Удалить проект">✕</button>
        <div class="project-image">
          <img src="${esc(proj.image)}" alt="${esc(proj.title)}" width="600" height="400" loading="lazy" decoding="async">
          <button type="button" class="image-edit-btn" data-index="${index}">Заменить фото</button>
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

  // ---------- HOBBIES ----------
  function hobbyCardHtml(hobby, index) {
    return `
      <article class="project-card reveal-scale" data-index="${index}" data-scope="hobby">
        <button type="button" class="delete-card-btn" data-scope="hobby" data-index="${index}" title="Удалить хобби" aria-label="Удалить хобби">✕</button>
        <div class="project-image">
          <img src="${esc(hobby.image)}" alt="${esc(hobby.title)}" width="600" height="400" loading="lazy" decoding="async">
          <button type="button" class="image-edit-btn" data-scope="hobby" data-index="${index}">Заменить фото</button>
        </div>
        <div class="project-body">
          <h3 class="project-title">${esc(hobby.title)}</h3>
          <p class="project-desc">${esc(hobby.description)}</p>
        </div>
      </article>
    `;
  }

  function renderHobbies() {
    const container = document.getElementById('hobbies-grid');
    container.innerHTML = (portfolioData.hobbies || []).map(hobbyCardHtml).join('');
  }

  function initAddExp() {
    const btn = document.getElementById('add-exp-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      if (!document.body.classList.contains('edit-mode')) return;
      const index = portfolioData.experience.length;
      portfolioData.experience.push({
        company: 'Новая компания',
        position: 'Должность',
        period: '2024 — н.в.',
        description: 'Краткое описание вашего опыта...',
        achievements: ['Первое достижение']
      });

      const container = document.getElementById('experience-list');
      container.insertAdjacentHTML('beforeend', expCardHtml(portfolioData.experience[index], index));
      const card = container.lastElementChild;
      card.classList.add('visible');
      if (index < 20) card.style.setProperty('--stagger', '0s');
      enableExperienceEditing();
      measureSections();
      showToast('Новый опыт добавлен — отредактируйте текст');
    });
  }

  function initAddProject() {
    const btn = document.getElementById('add-project-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      if (!document.body.classList.contains('edit-mode')) return;
      const index = portfolioData.projects.length;
      portfolioData.projects.push({
        title: 'Новый проект',
        description: 'Краткое описание проекта...',
        tags: ['Тег'],
        image: 'https://picsum.photos/seed/project' + index + '/600/400',
        link: '#'
      });

      const container = document.getElementById('projects-grid');
      container.insertAdjacentHTML('beforeend', `
        <article class="project-card reveal-scale" data-index="${index}">
          <button type="button" class="delete-card-btn" data-scope="projects" data-index="${index}" title="Удалить проект" aria-label="Удалить проект">✕</button>
          <div class="project-image">
            <img src="${esc(portfolioData.projects[index].image)}" alt="${esc(portfolioData.projects[index].title)}" width="600" height="400" loading="lazy" decoding="async">
            <button type="button" class="image-edit-btn" data-index="${index}">Заменить фото</button>
          </div>
          <div class="project-body">
            <h3 class="project-title">${esc(portfolioData.projects[index].title)}</h3>
            <p class="project-desc">${esc(portfolioData.projects[index].description)}</p>
            <div class="project-tags">
              ${portfolioData.projects[index].tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}
            </div>
          </div>
        </article>
      `);
      const card = container.lastElementChild;
      card.classList.add('visible');
      if (index < 20) card.style.setProperty('--stagger', '0s');
      enableProjectEditing();
      measureSections();
      showToast('Новый проект добавлен — отредактируйте текст');
    });
  }

  function initDeleteCards() {
    // Delegated so it keeps working after any re-render
    document.addEventListener('click', (event) => {
      if (!document.body.classList.contains('edit-mode')) return;
      const btn = event.target.closest ? event.target.closest('.delete-card-btn') : null;
      if (!btn) return;

      const scope = btn.dataset.scope;
      const index = Number(btn.dataset.index);
      const lists = {
        skills: () => portfolioData.skills,
        exp: () => portfolioData.experience,
        hobby: () => portfolioData.hobbies,
        projects: () => portfolioData.projects
      };
      const getList = lists[scope];
      if (!getList) return;

      const list = getList();
      const containerId = { skills: 'skills-grid', exp: 'experience-list', hobby: 'hobbies-grid', projects: 'projects-grid' }[scope];
      const cardSelector = { skills: '.skill-card', exp: '.exp-card', hobby: '.project-card', projects: '.project-card' }[scope];

      if (!list[index]) return;
      if (list.length <= 1) {
        showToast('Нельзя удалить последнюю запись');
        return;
      }

      list.splice(index, 1);
      const card = document.querySelector(`#${containerId} ${cardSelector}[data-index="${index}"]`);
      if (card) {
        // Re-inserting via render is fragile (reveal observer); remove the node
        // and renumber the remaining data-index attributes in place.
        card.remove();
        document.querySelectorAll(`#${containerId} ${cardSelector}`).forEach((el, i) => {
          el.dataset.index = String(i);
        });
        if (scope === 'skills') {
          document.querySelectorAll(`#${containerId} ${cardSelector}`).forEach((el, i) => {
            const progress = el.querySelector('.skill-progress');
            if (progress) progress.style.setProperty('--target-width', `${portfolioData.skills[i].level}%`);
          });
        }
      }
      measureSections();
      showToast('Запись удалена — нажмите «Сохранить»');
    });
  }

  // ---------- HOBBIES (edit mode) ----------
  function enableHobbyEditing() {
    qsa('#hobbies-grid .project-card').forEach((card) => {
      const title = card.querySelector('.project-title');
      const desc = card.querySelector('.project-desc');
      if (title) title.contentEditable = 'true';
      if (desc) desc.contentEditable = 'true';
    });
  }

  function saveHobbyEdits() {
    qsa('#hobbies-grid .project-card').forEach((card) => {
      const hobby = portfolioData.hobbies[Number(card.dataset.index)];
      if (!hobby) return;
      const titleEl = card.querySelector('.project-title');
      const descEl = card.querySelector('.project-desc');
      const title = cleanEditableText(titleEl && titleEl.innerText);
      const desc = cleanEditableText(descEl && descEl.innerText);
      if (title) hobby.title = title;
      if (desc) hobby.description = desc;
      if (titleEl) titleEl.textContent = hobby.title;
      if (descEl) descEl.textContent = hobby.description;
    });
  }

  function initAddHobby() {
    const btn = document.getElementById('add-hobby-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      if (!document.body.classList.contains('edit-mode')) return;
      const index = portfolioData.hobbies.length;
      portfolioData.hobbies.push({
        title: 'Новое хобби',
        description: 'Опишите своё увлечение...',
        image: 'https://picsum.photos/seed/hobby' + index + '/600/400'
      });

      const container = document.getElementById('hobbies-grid');
      container.insertAdjacentHTML('beforeend', hobbyCardHtml(portfolioData.hobbies[index], index));
      const card = container.lastElementChild;
      card.classList.add('visible');
      if (index < 20) card.style.setProperty('--stagger', '0s');
      enableHobbyEditing();
      measureSections();
      showToast('Новое хобби добавлено — отредактируйте текст');
    });
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

  // ---------- OWNER PIN GATE ----------
  // Режим редактирования открывается только после ввода PIN владельца.
  // В коде хранится хеш (SHA-256), а не сам PIN.
  const OWNER_PIN_SHA256 = 'd10d965dfd2a17d32d1c1d845bf2f51b43ba3b36a67abcb9863c98e449f2be1e';
  const OWNER_PIN_DJB2 = 2088258626; // fallback, если crypto.subtle недоступен (не-secure context)
  const OWNER_SESSION_KEY = 'portfolioOwnerSession';

  function isOwnerSession() {
    try {
      return sessionStorage.getItem(OWNER_SESSION_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function markOwnerSession() {
    try {
      sessionStorage.setItem(OWNER_SESSION_KEY, '1');
    } catch (e) { /* приватный режим браузера — просто не запоминаем */ }
  }

  function verifyPin(pin) {
    const text = String(pin == null ? '' : pin);
    if (window.crypto && window.crypto.subtle && window.TextEncoder) {
      return window.crypto.subtle
        .digest('SHA-256', new TextEncoder().encode(text))
        .then((buf) => {
          const hex = Array.prototype.map
            .call(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0'))
            .join('');
          return hex === OWNER_PIN_SHA256;
        })
        .catch(() => false);
    }
    // djb2-fallback
    let h = 5381;
    for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0;
    return Promise.resolve(h === OWNER_PIN_DJB2);
  }

  function initPinModal(onSuccess) {
    const modal = document.getElementById('pin-modal');
    if (!modal) return { open: function () {} };
    const card = modal.querySelector('.pin-modal__card');
    const input = document.getElementById('pin-input');
    const error = document.getElementById('pin-error');
    const submitBtn = document.getElementById('pin-submit');
    const closeBtn = document.getElementById('pin-close');
    const backdrop = modal.querySelector('[data-pin-close]');
    let active = false;

    function close() {
      active = false;
      modal.hidden = true;
      document.body.classList.remove('pin-open');
      const editBtn = document.getElementById('edit-btn');
      if (editBtn) editBtn.focus();
    }

    function open() {
      active = true;
      modal.hidden = false;
      document.body.classList.add('pin-open');
      error.hidden = true;
      input.value = '';
      input.focus();
    }

    function fail() {
      error.hidden = false;
      input.value = '';
      card.classList.remove('pin-shake');
      void card.offsetWidth; // перезапуск анимации
      card.classList.add('pin-shake');
      input.focus();
    }

    function submit() {
      verifyPin(input.value).then((ok) => {
        if (!ok) {
          fail();
          return;
        }
        markOwnerSession();
        close();
        if (typeof onSuccess === 'function') onSuccess();
      });
    }

    submitBtn.addEventListener('click', submit);
    closeBtn.addEventListener('click', close);
    if (backdrop) backdrop.addEventListener('click', close);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submit();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (active && e.key === 'Escape') close();
    });

    return { open: open, close: close };
  }

  function initEditMode() {
    const btn = document.getElementById('edit-btn');
    const pinModal = initPinModal(enterEditMode);

    function enterEditMode() {
      if (document.body.classList.contains('edit-mode')) return;
      document.body.classList.add('edit-mode');
      btn.classList.add('active');
      btn.textContent = 'Сохранить';
      enableEditing();
    }

    btn.addEventListener('click', () => {
      if (!document.body.classList.contains('edit-mode')) {
        // Вход в режим редактирования — только для владельца
        if (isOwnerSession()) {
          enterEditMode();
        } else {
          pinModal.open();
        }
        return;
      }

      // Выход (кнопка в состоянии «Сохранить»): PIN уже введён в этой сессии
      document.body.classList.remove('edit-mode');
      btn.classList.remove('active');
      btn.textContent = 'Редактировать';
      saveEdits();
      disableEditing();
      startTyping();
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

    enableProjectEditing();
    enableSkillEditing();
    enableExperienceEditing();
    enableHobbyEditing();
  }

  // ---------- SKILLS (edit mode) ----------
  function enableSkillEditing() {
    qsa('.skill-card').forEach((card) => {
      ['.skill-name', '.skill-level', '.skill-category'].forEach((sel) => {
        const el = card.querySelector(sel);
        if (el) el.contentEditable = 'true';
      });
    });
  }

  function saveSkillEdits() {
    qsa('.skill-card').forEach((card) => {
      const skill = portfolioData.skills[Number(card.dataset.index)];
      if (!skill) return;

      const nameEl = card.querySelector('.skill-name');
      const levelEl = card.querySelector('.skill-level');
      const catEl = card.querySelector('.skill-category');

      const name = cleanEditableText(nameEl && nameEl.innerText);
      const cat = cleanEditableText(catEl && catEl.innerText);
      if (name) skill.name = name;
      if (cat) skill.category = cat;

      // Level is edited as "95%" — keep only digits and clamp to 0..100
      const digits = String((levelEl && levelEl.innerText) || '').replace(/[^\d]/g, '');
      if (digits !== '') {
        skill.level = Math.min(100, Math.max(0, parseInt(digits, 10)));
      }

      // Update the card in place (a re-render would need re-observing)
      if (nameEl) nameEl.textContent = skill.name;
      if (catEl) catEl.textContent = skill.category;
      if (levelEl) levelEl.textContent = `${skill.level}%`;
      const progress = card.querySelector('.skill-progress');
      if (progress) progress.style.setProperty('--target-width', `${skill.level}%`);
    });
  }

  function initAddSkill() {
    const btn = document.getElementById('add-skill-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      if (!document.body.classList.contains('edit-mode')) return;
      const index = portfolioData.skills.length;
      portfolioData.skills.push({ name: 'Новый навык', level: 50, category: 'Категория' });

      const container = document.getElementById('skills-grid');
      container.insertAdjacentHTML('beforeend', skillCardHtml(portfolioData.skills[index], index));
      // Newly injected cards bypass the reveal observer, show them at once
      const card = container.lastElementChild;
      card.classList.add('visible');
      if (index < 20) card.style.setProperty('--stagger', '0s');
      enableSkillEditing();
      const nameEl = card.querySelector('.skill-name');
      if (nameEl) nameEl.focus();
      measureSections();
    });
  }

  // ---------- EXPERIENCE (edit mode) ----------
  function enableExperienceEditing() {
    qsa('.exp-card').forEach((card) => {
      ['.exp-company', '.exp-period', '.exp-position', '.exp-desc'].forEach((sel) => {
        const el = card.querySelector(sel);
        if (el) el.contentEditable = 'true';
      });
      const list = card.querySelector('.exp-achievements');
      if (list) list.contentEditable = 'true';
    });
  }

  function saveExperienceEdits() {
    qsa('.exp-card').forEach((card) => {
      const exp = portfolioData.experience[Number(card.dataset.index)];
      if (!exp) return;

      const companyEl = card.querySelector('.exp-company');
      const periodEl = card.querySelector('.exp-period');
      const posEl = card.querySelector('.exp-position');
      const descEl = card.querySelector('.exp-desc');
      const listEl = card.querySelector('.exp-achievements');

      const company = cleanEditableText(companyEl && companyEl.innerText);
      const period = cleanEditableText(periodEl && periodEl.innerText);
      const position = cleanEditableText(posEl && posEl.innerText);
      const desc = cleanEditableText(descEl && descEl.innerText);
      if (company) exp.company = company;
      if (period) exp.period = period;
      if (position) exp.position = position;
      if (desc) exp.description = desc;

      if (listEl) {
        // One achievement per line while editing; rebuild the <li> list
        const items = String(listEl.innerText || '')
          .split('\n')
          .map(cleanEditableText)
          .filter(Boolean);
        if (items.length) exp.achievements = items;
        listEl.textContent = '';
        exp.achievements.forEach((text) => {
          const li = document.createElement('li');
          li.textContent = text;
          listEl.appendChild(li);
        });
      }

      if (companyEl) companyEl.textContent = exp.company;
      if (periodEl) periodEl.textContent = exp.period;
      if (posEl) posEl.textContent = exp.position;
      if (descEl) descEl.textContent = exp.description;
    });
  }

  // ---------- PROJECT CARDS (edit mode) ----------
  function enableProjectEditing() {
    qsa('#projects-grid .project-card').forEach((card) => {
      const title = card.querySelector('.project-title');
      const desc = card.querySelector('.project-desc');
      const tags = card.querySelector('.project-tags');
      const proj = portfolioData.projects[Number(card.dataset.index)];
      if (title) title.contentEditable = 'true';
      if (desc) desc.contentEditable = 'true';
      if (tags) {
        // Show tags as plain comma-separated text while editing;
        // pills are rebuilt from the parsed list on save.
        tags.textContent = proj ? proj.tags.join(', ') : '';
        tags.contentEditable = 'true';
      }
    });
  }

  // Collapses whitespace so stray line breaks from contenteditable don't
  // leak into the saved data.
  function cleanEditableText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function saveProjectEdits() {
    qsa('#projects-grid .project-card').forEach((card) => {
      const proj = portfolioData.projects[Number(card.dataset.index)];
      if (!proj) return;

      const titleEl = card.querySelector('.project-title');
      const descEl = card.querySelector('.project-desc');
      const tagsEl = card.querySelector('.project-tags');

      const title = cleanEditableText(titleEl && titleEl.innerText);
      const desc = cleanEditableText(descEl && descEl.innerText);
      if (title) proj.title = title;
      if (desc) proj.description = desc;

      const tags = String((tagsEl && tagsEl.innerText) || '')
        .split(',')
        .map(cleanEditableText)
        .filter(Boolean);
      if (tags.length) proj.tags = tags;

      // Rebuild tag pills from the parsed list
      if (tagsEl) {
        tagsEl.textContent = '';
        proj.tags.forEach((text) => {
          const span = document.createElement('span');
          span.className = 'tag';
          span.textContent = text;
          tagsEl.appendChild(span);
        });
      }
    });
  }

  function initProjectImageEdit() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.hidden = true;
    document.body.appendChild(input);

    let pending = { scope: 'project', index: -1 };

    // Downscale to keep data URLs small enough for localStorage (~5 MB quota)
    function resizeImage(file, callback) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const MAX = 1000;
        let w = img.naturalWidth;
        let h = img.naturalHeight;
        if (w > MAX) {
          h = Math.round(h * MAX / w);
          w = MAX;
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        // WebP keeps transparency and compresses better; fall back to JPEG
        const out = canvas.toDataURL('image/webp', 0.8);
        callback(out.indexOf('data:image/webp') === 0 ? out : canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        callback(null);
      };
      img.src = url;
    }

    input.addEventListener('change', () => {
      const file = input.files && input.files[0];
      const list = pending.scope === 'exp' ? portfolioData.experience
        : pending.scope === 'hobby' ? (portfolioData.hobbies || [])
        : portfolioData.projects;
      const item = list[pending.index];
      input.value = '';
      if (!file || !item || pending.index < 0) return;

      if (file.type.indexOf('image/') !== 0) {
        showToast('Можно загружать только изображения');
        return;
      }

      resizeImage(file, (dataUrl) => {
        if (!dataUrl) {
          showToast('Не удалось прочитать изображение');
          return;
        }
        item.image = dataUrl;

        if (pending.scope === 'exp') {
          const card = document.querySelector(`.exp-card[data-index="${pending.index}"]`);
          const media = card && card.querySelector('.exp-media');
          if (media) {
            let img = media.querySelector('img');
            if (!img) {
              img = document.createElement('img');
              img.setAttribute('loading', 'lazy');
              img.setAttribute('decoding', 'async');
              media.insertBefore(img, media.firstChild);
            }
            img.src = dataUrl;
            img.alt = item.company || '';
            media.classList.add('has-image');
            const btn = media.querySelector('.image-edit-btn');
            if (btn) btn.textContent = 'Заменить фото';
          }
        } else if (pending.scope === 'hobby') {
          const card = document.querySelector(`#hobbies-grid .project-card[data-index="${pending.index}"]`);
          const img = card && card.querySelector('img');
          if (img) {
            img.src = dataUrl;
            img.alt = item.title;
          }
        } else {
          const card = document.querySelector(`#projects-grid .project-card[data-index="${pending.index}"]`);
          const img = card && card.querySelector('img');
          if (img) {
            img.src = dataUrl;
            img.alt = item.title;
          }
        }
        showToast('Фото обновлено — нажмите «Сохранить»');
      });
    });

    // Delegated so it keeps working after any re-render
    document.addEventListener('click', (event) => {
      if (!document.body.classList.contains('edit-mode')) return;
      const btn = event.target.closest ? event.target.closest('.image-edit-btn') : null;
      if (!btn) return;
      event.preventDefault();
      pending = {
        scope: btn.dataset.scope || 'project',
        index: Number(btn.dataset.index)
      };
      input.click();
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

    saveProjectEdits();
    saveSkillEdits();
    saveExperienceEdits();
    saveHobbyEdits();

    const savedOk = saveData();
    renderHero();
    renderAbout();
    renderContact();
    measureSections();
    if (savedOk) {
      showToast('Изменения сохранены!');
    } else {
      showToast('Не удалось сохранить: хранилище браузера переполнено');
    }
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
