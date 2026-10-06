// ============================================
// APP LOGIC
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Load saved data from localStorage if exists
  const saved = localStorage.getItem('portfolioData');
  if (saved) {
    try {
      Object.assign(portfolioData, JSON.parse(saved));
    } catch (e) {
      console.warn('Could not load saved data');
    }
  }

  renderAll();
  initTheme();
  initNav();
  initEditMode();
  initContactForm();
  initMobileMenu();
  initScrollAnimations();
  initHeaderScroll();
  initSmoothAnchors();
  initTypingEffect();
  initParallax();
});

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
  document.getElementById('logo-name').textContent = p.name.split(' ')[0];
  // Title is handled by typing effect
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
  container.classList.add('stagger');
  container.innerHTML = portfolioData.skills.map(skill => `
    <div class="skill-card reveal-scale">
      <div class="skill-header">
        <span class="skill-name">${skill.name}</span>
        <span class="skill-level">${skill.level}%</span>
      </div>
      <div class="skill-bar">
        <div class="skill-progress" style="--target-width: ${skill.level}%"></div>
      </div>
      <div class="skill-category">${skill.category}</div>
    </div>
  `).join('');
}

// ---------- EXPERIENCE ----------
function renderExperience() {
  const container = document.getElementById('experience-list');
  container.innerHTML = portfolioData.experience.map((exp, i) => `
    <div class="exp-card reveal" style="transition-delay: ${i * 0.12}s">
      <div class="exp-header">
        <div class="exp-company">${exp.company}</div>
        <div class="exp-period">${exp.period}</div>
      </div>
      <div class="exp-position">${exp.position}</div>
      <p class="exp-desc">${exp.description}</p>
      <ul class="exp-achievements">
        ${exp.achievements.map(a => `<li>${a}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

// ---------- PROJECTS ----------
function renderProjects() {
  const container = document.getElementById('projects-grid');
  container.classList.add('stagger');
  container.innerHTML = portfolioData.projects.map(proj => `
    <article class="project-card reveal-scale">
      <div class="project-image">
        <img src="${proj.image}" alt="${proj.title}" loading="lazy">
      </div>
      <div class="project-body">
        <h3 class="project-title">${proj.title}</h3>
        <p class="project-desc">${proj.description}</p>
        <div class="project-tags">
          ${proj.tags.map(t => `<span class="tag">${t}</span>`).join('')}
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
function initTheme() {
  const savedTheme = localStorage.getItem('portfolioTheme') || 'dark';
  setTheme(savedTheme);

  document.querySelectorAll('[data-set-theme]').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.setTheme;
      setTheme(theme);
      localStorage.setItem('portfolioTheme', theme);
    });
  });
}

function setTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }

  // Update active state of buttons
  document.querySelectorAll('[data-set-theme]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.setTheme === theme || (theme === 'dark' && btn.dataset.setTheme === 'dark'));
  });
}

// ---------- NAV HIGHLIGHT ----------
function initNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a, .mobile-nav a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (scrollY >= top) current = section.getAttribute('id');
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  });
}

// ---------- EDIT MODE ----------
function initEditMode() {
  const btn = document.getElementById('edit-btn');
  const hint = document.getElementById('edit-hint');

  btn.addEventListener('click', () => {
    const isEdit = document.body.classList.toggle('edit-mode');
    btn.classList.toggle('active', isEdit);
    btn.textContent = isEdit ? 'Сохранить' : 'Редактировать';

    if (isEdit) {
      enableEditing();
    } else {
      saveEdits();
      disableEditing();
    }
  });
}

function enableEditing() {
  // Make personal info editable
  const editables = [
    'hero-name', 'hero-title', 'hero-subtitle',
    'about-text', 'info-email', 'info-phone', 'info-location', 'info-telegram',
    'contact-email', 'contact-phone', 'contact-location', 'contact-telegram'
  ];

  editables.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.contentEditable = true;
      el.dataset.original = el.textContent;
    }
  });
}

function disableEditing() {
  document.querySelectorAll('[contenteditable="true"]').forEach(el => {
    el.contentEditable = false;
  });
}

function saveEdits() {
  const p = portfolioData.personal;
  p.name = document.getElementById('hero-name').textContent.trim();
  p.title = document.getElementById('hero-title').textContent.trim();
  p.subtitle = document.getElementById('hero-subtitle').textContent.trim();
  p.about = document.getElementById('about-text').textContent.trim();
  p.email = document.getElementById('info-email').textContent.trim();
  p.phone = document.getElementById('info-phone').textContent.trim();
  p.location = document.getElementById('info-location').textContent.trim();
  p.telegram = document.getElementById('info-telegram').textContent.trim();

  // Update logo
  document.getElementById('logo-name').textContent = p.name.split(' ')[0];

  // Save to localStorage
  localStorage.setItem('portfolioData', JSON.stringify(portfolioData));

  // Show toast
  showToast('Изменения сохранены!');
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'edit-hint';
  toast.style.display = 'block';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

// ---------- CONTACT FORM ----------
function initContactForm() {
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value;
    showToast(`Спасибо, ${name}! Сообщение отправлено (демо).`);
    form.reset();
  });
}

// ---------- MOBILE MENU ----------
function initMobileMenu() {
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobile-nav');

  burger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileNav.classList.remove('open'));
  });
}

// ---------- SCROLL ANIMATIONS ----------
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -60px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Helper to observe elements
  function observe(selector, className = 'reveal', stagger = 0) {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add(className);
      if (stagger > 0) {
        el.style.transitionDelay = `${i * stagger}s`;
      }
      observer.observe(el);
    });
  }

  // Section titles & subtitles
  observe('.section-title', 'reveal');
  observe('.section-subtitle', 'reveal');

  // About
  observe('.about-text', 'reveal-left');
  observe('.info-item', 'reveal-right', 0.1);

  // Skills (already have reveal-scale from render)
  document.querySelectorAll('.skill-card').forEach(el => observer.observe(el));

  // Experience (already have reveal from render)
  document.querySelectorAll('.exp-card').forEach(el => observer.observe(el));

  // Projects (already have reveal-scale from render)
  document.querySelectorAll('.project-card').forEach(el => observer.observe(el));

  // Contact
  observe('.contact-info .contact-item', 'reveal-left', 0.1);
  observe('.contact-form', 'reveal-right');
}

// ---------- HEADER SCROLL EFFECT ----------
function initHeaderScroll() {
  const header = document.querySelector('.header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = current;
  }, { passive: true });
}

// ---------- SMOOTH ANCHOR SCROLL ----------
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ---------- TYPING EFFECT ----------
function initTypingEffect() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    portfolioData.personal.title,
    'Создаю красивые интерфейсы',
    'Пишу чистый и быстрый код',
    'Frontend + UI/UX'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function type() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 35;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 70;
    }

    if (!isDeleting && charIndex === current.length) {
      // Pause at the end
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  // Start after a short delay so hero animations can play
  setTimeout(type, 900);
}

// ---------- PARALLAX ----------
function initParallax() {
  const layers = document.querySelectorAll('.parallax-layer');
  if (!layers.length) return;

  // Mouse move parallax on hero
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      layers.forEach(layer => {
        const speed = parseFloat(layer.dataset.speed) || 0.1;
        const moveX = x * 60 * speed;
        const moveY = y * 40 * speed;
        layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    });

    // Reset on mouse leave
    hero.addEventListener('mouseleave', () => {
      layers.forEach(layer => {
        layer.style.transition = 'transform 0.6s ease';
        layer.style.transform = 'translate(0, 0)';
        setTimeout(() => {
          layer.style.transition = '';
        }, 600);
      });
    });
  }

  // Scroll parallax for layers
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        layers.forEach(layer => {
          const speed = parseFloat(layer.dataset.speed) || 0.1;
          // Only apply scroll parallax while hero is somewhat visible
          if (scrollY < window.innerHeight) {
            const offset = scrollY * speed * 0.5;
            // Combine with existing mouse transform if any — simple override for scroll
            layer.style.transform = `translateY(${offset}px)`;
          }
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}
