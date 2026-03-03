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

    // Hamburger menu button
    const menuToggle = '<button class="menu-toggle" aria-label="Menu">☰</button>';

    // Build navigation links with hash URLs (remove .html)
    const navHtml = headerData.nav.map(item => {
      if (item.dropdown) {
        return `
          <div class="dropdown">
            <a href="#">${item.text} ▾</a>
            <div class="dropdown-content">
              ${item.dropdown.map(sub => `<a href="#${sub.url.replace('.html', '')}">${sub.text}</a>`).join('')}
            </div>
          </div>
        `;
      } else {
        // Home → # , others → #page-name
        const hash = item.url === 'index.html' ? '#' : `#${item.url.replace('.html', '')}`;
        return `<a href="${hash}">${item.text}</a>`;
      }
    }).join('');

    header.innerHTML = `
      <div class="header-left">
        <img src="${headerData.logo}" class="logo-img">
        <img src="${headerData.logoText}" class="logo-img second-logo">
      </div>
      <nav class="nav-links">${navHtml}</nav>
      ${menuToggle}
    `;

    // Mobile menu toggle
    const toggle = header.querySelector('.menu-toggle');
    const nav = header.querySelector('.nav-links');
    if (toggle && nav) {
      toggle.addEventListener('click', () => nav.classList.toggle('active'));
    }

    // Touch‑friendly dropdowns on mobile
    document.querySelectorAll('.dropdown > a').forEach(link => {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          link.parentElement.classList.toggle('active');
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
    const slides = document.querySelectorAll('.hero-slide');
    if (!slides.length) return;
    let current = 0;
    setInterval(() => {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 4000);
  }

  static footer(text) {
    const footer = document.querySelector('footer');
    if (footer) footer.innerHTML = text;
  }

  static pageContent(pageName, pageData) {
    const main = document.getElementById('main-content');
    if (!main) return;

    // ----- HOME PAGE (index) -----
    if (pageName === 'index' && pageData.services) {
      main.innerHTML = `
        <section class="services-section">
          <h2 class="section-title">Our Services</h2>
          <div class="services-grid">
            ${pageData.services.map(service => `
              <a href="#${service.link.replace('.html', '')}" class="service-card">
                <div class="service-image"><img src="${service.image}" alt="${service.title}"></div>
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
            <div class="contact-item"><span class="icon">✉</span><span>${pageData.contact.email}</span></div>
            <div class="contact-item"><span class="icon">📞</span><span>${pageData.contact.phone}</span></div>
            <div class="contact-item"><span class="icon">📍</span><span>${pageData.contact.address}</span></div>
            <div class="social-row">
              ${pageData.contact.social.map(s => `<a href="${s.url}" class="social-icon" title="${s.title}">${s.icon}</a>`).join('')}
            </div>
          </div>
        </section>
      `;
      return;
    }

    // ----- ALL OTHER PAGES (about, shared, ssl, zimbra, domain, cloud, onpremise) -----
    if (!pageData || !pageData.title) return;

    let html = `<section class="inner-page"><div class="about-container"><div class="about-text">`;

    html += `<h3>${pageData.title}</h3>`;
    if (pageData.intro) html += `<p>${pageData.intro}</p>`;
    if (pageData.paragraphs) pageData.paragraphs.forEach(p => html += `<p>${p}</p>`);

    // SSL benefits
    if (pageData.benefits) {
      html += `<h3>Benefits of SSL Certificate</h3><ul>`;
      pageData.benefits.forEach(b => html += `<li>${b}</li>`);
      html += `</ul>`;
    }
    if (pageData.types) html += `<h3>Types of SSL We Offer</h3><p>${pageData.types}</p>`;
    if (pageData.closing) html += `<p>${pageData.closing}</p>`;

    // Cloud features
    if (pageData.features) {
      html += `<h3>Key Features</h3><ul>`;
      pageData.features.forEach(f => html += `<li>${f}</li>`);
      html += `</ul>`;
    }
    if (pageData.why) html += `<h3>Why Choose GreenBD Cloud VPS?</h3><p>${pageData.why}</p>`;

    // On‑premise specific
    if (pageData.ownership) html += `<h3>${pageData.ownership}</h3><p>${pageData.ownershipText}</p>`;
    if (pageData.idealFor) {
      html += `<h3>${pageData.idealFor}</h3><ul>`;
      pageData.idealList.forEach(i => html += `<li>${i}</li>`);
      html += `</ul>`;
    }
    if (pageData.support) html += `<h3>${pageData.support}</h3><p>${pageData.supportText}</p>`;

    html += `</div><div class="about-image"><img src="${pageData.image}" alt="${pageData.title}"></div></div></section>`;
    main.innerHTML = html;
  }
}

// ==================== Router (hash‑based) ====================
class Router {
  constructor(app) {
    this.app = app;
    window.addEventListener('hashchange', () => this.app.loadPageFromHash());
    window.addEventListener('load', () => this.app.loadPageFromHash());
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
    // Page will be loaded by router on 'load' event
  }

  loadPageFromHash() {
    // Get hash without '#', default to 'index'
    const hash = window.location.hash.substring(1) || 'index';
    const pageName = hash.replace('.html', ''); // remove any accidental .html
    const pageData = this.data.pages[pageName] || this.data.pages.index;
    Renderer.pageContent(pageName, pageData);

    // Close mobile menu after navigation
    const nav = document.querySelector('.nav-links');
    if (nav) nav.classList.remove('active');
  }
}

// Start the application
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});