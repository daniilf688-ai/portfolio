// ============================================
// ДАННЫЕ ПОРТФОЛИО — РЕДАКТИРУЙТЕ ЗДЕСЬ
// ============================================

const portfolioData = {
  // Личная информация
  personal: {
    name: "Даниил Борисович",
    title: "Frontend-разработчик & UI/UX дизайнер",
    subtitle: "Создаю современные и удобные цифровые продукты",
    about: "Привет! Я Даниил Борисович — frontend-разработчик и UI/UX дизайнер с более чем 6-летним опытом. Специализируюсь на создании быстрых, красивых и удобных веб-приложений. Люблю чистый код, продуманный дизайн и внимание к деталям. Работал с крупными компаниями и стартапами, всегда стремлюсь к результату, который радует пользователей.",
    email: "daniil.borisovich@example.com",
    phone: "+7 (999) 123-45-67",
    location: "Москва, Россия",
    telegram: "@daniil_dev",
    github: "github.com/daniil-borisovich",
    linkedin: "linkedin.com/in/daniil-borisovich"
  },

  // Навыки (можно добавлять, удалять, менять уровень 0-100)
  skills: [
    { name: "HTML / CSS", level: 95, category: "Frontend" },
    { name: "JavaScript", level: 92, category: "Frontend" },
    { name: "TypeScript", level: 88, category: "Frontend" },
    { name: "React", level: 90, category: "Frontend" },
    { name: "Next.js", level: 85, category: "Frontend" },
    { name: "Vue.js", level: 78, category: "Frontend" },
    { name: "Figma", level: 93, category: "Design" },
    { name: "UI/UX Design", level: 90, category: "Design" },
    { name: "Node.js", level: 75, category: "Backend" },
    { name: "Git / GitHub", level: 88, category: "Tools" },
    { name: "Tailwind CSS", level: 92, category: "Frontend" },
    { name: "Webpack / Vite", level: 80, category: "Tools" }
  ],

  // Опыт работы и достижения
  experience: [
    {
      company: "TechNova Solutions",
      position: "Senior Frontend Developer",
      period: "2023 — настоящее время",
      description: "Разработка сложных SPA и дизайн-систем для корпоративных клиентов.",
      achievements: [
        "Увеличил скорость загрузки ключевых страниц на 47% за счёт оптимизации и code-splitting",
        "Внедрил дизайн-систему, сократившую время разработки новых интерфейсов на 35%",
        "Руководил командой из 4 frontend-разработчиков"
      ]
    },
    {
      company: "Digital Pulse Agency",
      position: "UI/UX Designer & Frontend Developer",
      period: "2020 — 2023",
      description: "Полный цикл: от проектирования интерфейсов до реализации.",
      achievements: [
        "Спроектировал и реализовал более 25 коммерческих проектов",
        "Повысил конверсию лендингов клиентов в среднем на 28%",
        "Создал библиотеку переиспользуемых UI-компонентов"
      ]
    },
    {
      company: "StartUp Hub",
      position: "Junior Frontend Developer",
      period: "2018 — 2020",
      description: "Разработка интерфейсов для стартапов и MVP-продуктов.",
      achievements: [
        "Участвовал в запуске 8 успешных MVP",
        "Освоил React и современные подходы к разработке",
        "Получил благодарность за качество кода и скорость работы"
      ]
    }
  ],

  // Галерея проектов
  projects: [
    {
      title: "FinTrack — личный кабинет финансов",
      description: "Современный дашборд для управления личными финансами с графиками и аналитикой.",
      tags: ["React", "TypeScript", "Chart.js"],
      image: "https://picsum.photos/seed/fintrack/600/400",
      link: "#"
    },
    {
      title: "EcoShop — интернет-магазин",
      description: "E-commerce платформа с акцентом на экологичные товары и удобный UX.",
      tags: ["Next.js", "Tailwind", "Stripe"],
      image: "https://picsum.photos/seed/ecoshop/600/400",
      link: "#"
    },
    {
      title: "MindSpace — приложение для медитации",
      description: "Минималистичный интерфейс с анимациями и персонализированными рекомендациями.",
      tags: ["React", "Framer Motion", "Firebase"],
      image: "https://picsum.photos/seed/mindspace/600/400",
      link: "#"
    },
    {
      title: "ArchViz Portfolio",
      description: "Сайт-портфолио для архитектурной студии с 3D-просмотром проектов.",
      tags: ["Three.js", "GSAP", "WebGL"],
      image: "https://picsum.photos/seed/archviz/600/400",
      link: "#"
    },
    {
      title: "TaskFlow — менеджер задач",
      description: "Кроссплатформенное приложение для командной работы с kanban-досками.",
      tags: ["Vue 3", "Pinia", "Node.js"],
      image: "https://picsum.photos/seed/taskflow/600/400",
      link: "#"
    },
    {
      title: "Foodie — сервис доставки еды",
      description: "Мобильный-first дизайн с плавными анимациями и удобным оформлением заказа.",
      tags: ["React Native", "UI/UX", "Figma"],
      image: "https://picsum.photos/seed/foodie/600/400",
      link: "#"
    }
  ]
};
