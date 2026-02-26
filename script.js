document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch('data.json');
    const data = await response.json();

    // Determine current page (filename)
    const path = window.location.pathname.split('/').pop() || 'index.html';
    const pageName = path.replace('.html', '') || 'index';

    // Render global elements
    renderHeader(data.global.header);
    renderHero(data.global.heroSlides);
    renderFooter(data.global.footer);

    // Render page-specific content
    const pageData = data.pages[pageName] || data.pages['index']; // fallback to index
    renderPageContent(pageName, pageData);

    // Start hero slider (existing functionality)
    initHeroSlider();

  } catch (error) {
    console.error('Failed to load content:', error);
  }
});

function renderHeader(headerData) {
  const header = document.querySelector('.premium-header');
  if (!header) return;

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
  `;
}

function renderHero(slides) {
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
}

function renderFooter(text) {
  const footer = document.querySelector('footer');
  if (footer) footer.innerHTML = text;
}

function renderPageContent(pageName, pageData) {
  // Services on index
  if (pageName === 'index' && pageData.services) {
    const grid = document.querySelector('.services-grid');
    if (grid) {
      grid.innerHTML = pageData.services.map(service => `
        <a href="${service.link}" class="service-card">
          <div class="service-image">
            <img src="${service.image}" alt="${service.title}">
          </div>
          <div class="service-content">
            <h3>${service.title}</h3>
            <p>${service.description}</p>
          </div>
        </a>
      `).join('');
    }

    // Contact section
    const contactInner = document.querySelector('.contact-inner');
    if (contactInner && pageData.contact) {
      const c = pageData.contact;
      contactInner.innerHTML = `
        <h2>Get in Touch:</h2>
        <div class="contact-item">
          <span class="icon">✉</span>
          <span>${c.email}</span>
        </div>
        <div class="contact-item">
          <span class="icon">📞</span>
          <span>${c.phone}</span>
        </div>
        <div class="contact-item">
          <span class="icon">📍</span>
          <span>${c.address}</span>
        </div>
        <div class="social-row">
          ${c.social.map(s => `
            <a href="${s.url}" class="social-icon" title="${s.title}">${s.icon}</a>
          `).join('')}
        </div>
      `;
    }
  }

  // Inner pages (about, shared, ssl, zimbra, domain, cloud, onpremise)
  const container = document.querySelector('.about-container');
  if (container && pageData.title) {
    let html = `<div class="about-text">`;

    // Title
    html += `<h3>${pageData.title}</h3>`;

    // Intro (if exists, e.g. ssl, cloud)
    if (pageData.intro) {
      html += `<p>${pageData.intro}</p>`;
    }

    // Paragraphs (common)
    if (pageData.paragraphs) {
      pageData.paragraphs.forEach(p => html += `<p>${p}</p>`);
    }

    // Benefits (ssl)
    if (pageData.benefits) {
      html += `<h3>Benefits of SSL Certificate</h3><ul>`;
      pageData.benefits.forEach(item => html += `<li>${item}</li>`);
      html += `</ul>`;
    }

    // Types (ssl)
    if (pageData.types) {
      html += `<h3>Types of SSL We Offer</h3><p>${pageData.types}</p>`;
    }

    // Closing (ssl, cloud)
    if (pageData.closing) {
      html += `<p>${pageData.closing}</p>`;
    }

    // Features (cloud)
    if (pageData.features) {
      html += `<h3>Key Features</h3><ul>`;
      pageData.features.forEach(item => html += `<li>${item}</li>`);
      html += `</ul>`;
    }

    // Why (cloud)
    if (pageData.why) {
      html += `<h3>Why Choose GreenBD Cloud VPS?</h3><p>${pageData.why}</p>`;
    }

    // On‑premise specific sections
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

    html += `</div><div class="about-image"><img src="${pageData.image}" alt="GreenBD Hosting"></div>`;
    container.innerHTML = html;
  }
}

// Original hero slider function (unchanged)
function initHeroSlider() {
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