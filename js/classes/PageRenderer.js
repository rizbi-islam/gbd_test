/**
 * PageRenderer — Responsible for rendering all page views into the #app container.
 * Each page type has a dedicated private render method, keeping concerns separated.
 */
class PageRenderer {
  /**
   * @param {HTMLElement} container  The #app main element.
   * @param {DataStore}   store      The shared DataStore instance.
   */
  constructor(container, store) {
    this._container = container;
    this._store = store;
    this._currentSlider = null;
  }

  /**
   * Render the appropriate view for the given page key.
   * Destroys any active HeroSlider before re-rendering.
   * @param {string} pageKey  e.g. "index", "about-us", "ssl"
   */
  render(pageKey) {
    // Teardown previous slider if present
    if (this._currentSlider) {
      this._currentSlider.destroy();
      this._currentSlider = null;
    }

    const pageData = this._store.getPage(pageKey);
    const { heroSlides } = this._store.global;

    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });

    switch (pageKey) {
      case 'index':
        this._renderHome(pageData, heroSlides);
        break;
      default:
        this._renderInnerPage(pageData, heroSlides, pageKey);
        break;
    }
  }

  // ─── Page Views ─────────────────────────────────────────────────────────────

  _renderHome(pageData, heroSlides) {
    this._container.innerHTML = `
      <section class="hero" aria-label="Hero banner"></section>
      <section class="services-section">
        <h2 class="section-title">Our Services</h2>
        <div class="services-grid">${this._buildServicesGrid(pageData.services)}</div>
      </section>
      <section class="contact" aria-label="Contact information">
        <div class="contact-inner">${this._buildContact(pageData.contact)}</div>
      </section>
    `;

    const heroEl = this._container.querySelector('.hero');
    this._currentSlider = new HeroSlider(heroEl, heroSlides);
    this._currentSlider.render();
  }

  _renderInnerPage(pageData, heroSlides, pageKey) {
    this._container.innerHTML = `
      <section class="hero" aria-label="Hero banner"></section>
      <section class="inner-page" aria-label="${pageData.title || 'Page content'}">
        <div class="about-container">${this._buildInnerContent(pageData)}</div>
      </section>
    `;

    const heroEl = this._container.querySelector('.hero');
    this._currentSlider = new HeroSlider(heroEl, heroSlides);
    this._currentSlider.render();
  }

  // ─── Content Builders ───────────────────────────────────────────────────────

  _buildServicesGrid(services = []) {
    return services.map(s => `
      <a href="${s.link}" class="service-card" aria-label="${s.title}">
        <div class="service-image">
          <img src="${s.image}" alt="${s.title}" loading="lazy">
        </div>
        <div class="service-content">
          <h3>${s.title}</h3>
          <p>${s.description}</p>
        </div>
      </a>
    `).join('');
  }

  _buildContact(c) {
    if (!c) return '';
    return `
      <h2>Get in Touch</h2>
      <div class="contact-item"><span class="icon" aria-hidden="true">✉</span><span>${c.email}</span></div>
      <div class="contact-item"><span class="icon" aria-hidden="true">📞</span><span>${c.phone}</span></div>
      <div class="contact-item"><span class="icon" aria-hidden="true">📍</span><span>${c.address}</span></div>
      <div class="social-row">
        ${(c.social || []).map(s => `
          <a href="${s.url}" class="social-icon" title="${s.title}" aria-label="${s.title}">${s.icon}</a>
        `).join('')}
      </div>
    `;
  }

  _buildInnerContent(d) {
    if (!d || !d.title) return '<p>Page not found.</p>';

    let html = `<div class="about-text">`;

    html += `<h3>${d.title}</h3>`;

    if (d.intro)         html += `<p class="intro-text">${d.intro}</p>`;
    if (d.paragraphs)    d.paragraphs.forEach(p => { html += `<p>${p}</p>`; });

    if (d.benefits) {
      html += `<h3>Benefits of SSL Certificate</h3><ul class="feature-list">`;
      d.benefits.forEach(item => { html += `<li>${item}</li>`; });
      html += `</ul>`;
    }

    if (d.types)         html += `<h3>Types of SSL We Offer</h3><p>${d.types}</p>`;
    if (d.features) {
      html += `<h3>Key Features</h3><ul class="feature-list">`;
      d.features.forEach(item => { html += `<li>${item}</li>`; });
      html += `</ul>`;
    }

    if (d.why)           html += `<h3>Why Choose GreenBD Cloud VPS?</h3><p>${d.why}</p>`;
    if (d.ownership)     html += `<h3>${d.ownership}</h3><p>${d.ownershipText}</p>`;
    if (d.idealFor) {
      html += `<h3>${d.idealFor}</h3><ul class="feature-list">`;
      (d.idealList || []).forEach(item => { html += `<li>${item}</li>`; });
      html += `</ul>`;
    }

    if (d.support)       html += `<h3>${d.support}</h3><p>${d.supportText}</p>`;
    if (d.closing)       html += `<p class="closing-text">${d.closing}</p>`;

    html += `</div>`;
    if (d.image) {
      html += `<div class="about-image"><img src="${d.image}" alt="${d.title}" loading="lazy"></div>`;
    }

    return html;
  }
}
