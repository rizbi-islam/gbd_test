// ==================== DataService ====================
class DataService {
  static async load() {
    const res = await fetch('data.json');
    return await res.json();
  }
}

// ==================== Renderer ====================
class Renderer {
  static header(headerData) {
    const header = document.querySelector('.premium-header');
    if (!header) return;

    // Add hamburger menu button for mobile
    const menuToggle = '<button class="menu-toggle" aria-label="Menu">☰</button>';

    header.innerHTML = `
      <div class="header-left">
        <img src="${headerData.logo}" class="logo-img">
        <img src="${headerData.logoText}" class="logo-img second-logo">
      </div>
      <nav class="nav-links">
        ${headerData.nav.map(item => {
          if (item.dropdown) {
            return `
              <div class="dropdown">
                <a href="#">${item.text} ▾</a>
                <div class="dropdown-content">
                  ${item.dropdown.map(sub => `<a href="${sub.url}">${sub.text}</a>`).join('')}
                </div>
              </div>
            `;
          } else {
            return `<a href="${item.url}">${item.text}</a>`;
          }
        }).join('')}
      </nav>
      ${menuToggle}
    `;

    // Mobile menu toggle
    const toggle = header.querySelector('.menu-toggle');
    const nav = header.querySelector('.nav-links');
    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        nav.classList.toggle('active');
      });
    }

    // Touch-friendly dropdowns on mobile
    document.querySelectorAll('.dropdown > a').forEach(link => {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          const parent = link.parentElement;
          parent.classList.toggle('active');
        }
      });
    });
  }

  static hero(slides) {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    hero.innerHTML = slides.map((slide, index) => `
      <div class="hero-slide ${index === 0 ? 'active' : ''}" style="background-image:url('${slide.bgImage}')">
        <div class="slide-content">
          <h1>${slide.title}</h1>
          <p>${slide.description}</p>
        </div>
      </div>
    `).join('');

    this.initHeroSlider();
  }

  static initHeroSlider() {
    const slides = document.querySelectorAll(".hero-slide");
    if (!slides.length) return;

    let currentIndex = 0;
    const slideInterval = 4000;

    function showNextSlide() {
      slides[currentIndex].classList.remove("active");
      currentIndex = (currentIndex + 1) % slides.length;
      slides[currentIndex].classList.add("active");
    }

    setInterval(showNextSlide, slideInterval);
  }

  static footer(text) {
    const footer = document.querySelector('footer');
    if (footer) footer.innerHTML = text;
  }

  static pageContent(pageName, pageData) {
    const main = document.getElementById('main-content');
    if (!main) return;

    // Home page (index) has services and contact
    if (pageName === 'index' && pageData.services) {
      main.innerHTML = `
        <section class="services-section">
          <h2 class="section-title">Our Services</h2>
          <div class="services-grid">
            ${pageData.services.map(service => `
              <a href="${service.link}" class="service-card">
                <div class="service-image">
                  <img src="${service.image}" alt="${service.title}">
                </div>
                <div class="service-content">
                  <h3>${service.title}</h3>
                  <p>${service.description}</p>
                </div>
              </a>
            `).join('')}
          </div>
        </section>
        <section class="contact">
          <div class="contact-inner">
            <h2>Get in Touch:</h2>
            <div class="contact-item">
              <span class="icon">✉</span>
              <span>${pageData.contact.email}</span>
            </div>
            <div class="contact-item">
              <span class="icon">📞</span>
              <span>${pageData.contact.phone}</span>
            </div>
            <div class="contact-item">
              <span class="icon">📍</span>
              <span>${pageData.contact.address}</span>
            </div>
            <div class="social-row">
              ${pageData.contact.social.map(s => `
                <a href="${s.url}" class="social-icon" title="${s.title}">${s.icon}</a>
              `).join('')}
            </div>
          </div>
        </section>
      `;
      return;
    }

    // All other pages use about-container layout
    if (!pageData.title) return;

    let html = `<section class="inner-page"><div class="about-container"><div class="about-text">`;

    // Title
    html += `<h3>${pageData.title}</h3>`;

    // Intro (if exists)
    if (pageData.intro) {
      html += `<p>${pageData.intro}</p>`;
    }

    // Paragraphs
    if (pageData.paragraphs) {
      pageData.paragraphs.forEach(p => html += `<p>${p}</p>`);
    }

    // Benefits (SSL)
    if (pageData.benefits) {
      html += `<h3>Benefits of SSL Certificate</h3><ul>`;
      pageData.benefits.forEach(item => html += `<li>${item}</li>`);
      html += `</ul>`;
    }

    // Types (SSL)
    if (pageData.types) {
      html += `<h3>Types of SSL We Offer</h3><p>${pageData.types}</p>`;
    }

    // Closing (SSL, Cloud)
    if (pageData.closing) {
      html += `<p>${pageData.closing}</p>`;
    }

    // Features (Cloud)
    if (pageData.features) {
      html += `<h3>Key Features</h3><ul>`;
      pageData.features.forEach(item => html += `<li>${item}</li>`);
      html += `</ul>`;
    }

    // Why (Cloud)
    if (pageData.why) {
      html += `<h3>Why Choose GreenBD Cloud VPS?</h3><p>${pageData.why}</p>`;
    }

    // On-premise specific
    if (pageData.ownership) {
      html += `<h3>${pageData.ownership}</h3><p>${pageData.ownershipText}</p>`;
    }
    if (pageData.idealFor) {
      html += `<h3>${pageData.idealFor}</h3><ul>`;
      pageData.idealList.forEach(item => html += `<li>${item}</li>`);
      html += `</ul>`;
    }
    if (pageData.support) {
      html += `<h3>${pageData.support}</h3><p>${pageData.supportText}</p>`;
    }

    html += `</div><div class="about-image"><img src="${pageData.image}" alt="GreenBD Hosting"></div></div></section>`;
    main.innerHTML = html;
  }
}

// ==================== Router ====================
class Router {
  constructor(app) {
    this.app = app;
    window.addEventListener('popstate', () => this.app.loadPageFromURL());
  }

  navigate(url, pushState = true) {
    if (pushState) history.pushState(null, '', url);
    this.app.loadPageFromURL();

    // Close mobile menu after navigation
    const nav = document.querySelector('.nav-links');
    if (nav) nav.classList.remove('active');
  }
}

// ==================== App ====================
class App {
  constructor() {
    this.data = null;
    this.router = new Router(this);
  }

  async init() {
    this.data = await DataService.load();
    Renderer.header(this.data.global.header);
    Renderer.hero(this.data.global.heroSlides);
    Renderer.footer(this.data.global.footer);
    this.loadPageFromURL();
    this.attachNavListeners();
  }

  loadPageFromURL() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    const pageName = path.replace('.html', '') || 'index';
    const pageData = this.data.pages[pageName] || this.data.pages.index;
    Renderer.pageContent(pageName, pageData);
  }

  attachNavListeners() {
    // Listen for clicks on any link inside .nav-links (including dropdown items)
    document.querySelector('.nav-links').addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link || link.getAttribute('href').startsWith('#')) return;

      // Only handle internal links (same origin)
      const url = link.getAttribute('href');
      if (url.startsWith('http') && new URL(url, window.location.origin).origin !== window.location.origin) {
        return; // external link
      }

      e.preventDefault();
      this.router.navigate(url);
    });
  }
}

// Start the app
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});