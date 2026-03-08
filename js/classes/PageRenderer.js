class PageRenderer {
  constructor(container, store) {
    this._container    = container;
    this._store        = store;
    this._activeSlider = null;
  }

  render(pageKey) {
    if (this._activeSlider) { this._activeSlider.destroy(); this._activeSlider = null; }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const pageData  = this._store.getPage(pageKey);
    const { heroSlides } = this._store.global;

    if (pageKey === 'index') {
      this._renderHome(pageData, heroSlides);
    } else {
      this._renderInner(pageData, heroSlides);
    }
  }

  _renderHome(page, slides) {
    this._container.innerHTML = `
      <section class="hero"></section>
      <section class="services-section">
        <h2 class="section-title">Our Services</h2>
        <div class="services-grid">${this._buildCards(page.services)}</div>
      </section>
      <section class="contact">
        <div class="contact-inner">${this._buildContact(page.contact)}</div>
      </section>`;
    this._mountSlider(slides);
    this._bindCards();
  }

  _renderInner(page, slides) {
    this._container.innerHTML = `
      <section class="hero"></section>
      <section class="inner-page">
        <div class="about-container">${this._buildInnerContent(page)}</div>
      </section>`;
    this._mountSlider(slides);
  }

  _mountSlider(slides) {
    this._activeSlider = new HeroSlider(this._container.querySelector('.hero'), slides);
    this._activeSlider.render();
  }

  _buildCards(list = []) {
    return list.map(s => `
      <div class="service-card" data-link="${s.link}">
        <div class="service-image"><img src="${s.image}" alt="${s.title}" loading="lazy"></div>
        <div class="service-content"><h3>${s.title}</h3><p>${s.description}</p></div>
      </div>`).join('');
  }

  _bindCards() {
    this._container.querySelectorAll('.service-card[data-link]').forEach(card => {
      card.addEventListener('click', () => { window.location.hash = card.dataset.link; });
    });
  }

  _buildContact(c) {
    if (!c) return '';
    const socials = (c.social || []).map(s =>
      `<a href="${s.url}" class="social-icon" title="${s.title}">${s.icon}</a>`
    ).join('');
    return `
      <h2>Get in Touch</h2>
      <div class="contact-item"><span class="icon">&#9993;</span><span>${c.email}</span></div>
      <div class="contact-item"><span class="icon">&#128222;</span><span>${c.phone}</span></div>
      <div class="contact-item"><span class="icon">&#128205;</span><span>${c.address}</span></div>
      <div class="social-row">${socials}</div>`;
  }

  _buildInnerContent(d) {
    if (!d?.title) return '<p>Page not found.</p>';
    let h = `<div class="about-text"><h3>${d.title}</h3>`;
    if (d.intro)      h += `<p class="intro-text">${d.intro}</p>`;
    if (d.paragraphs) d.paragraphs.forEach(p => { h += `<p>${p}</p>`; });
    if (d.benefits) {
      h += `<h3>Benefits of SSL Certificate</h3><ul class="feature-list">`;
      d.benefits.forEach(b => { h += `<li>${b}</li>`; });
      h += `</ul>`;
    }
    if (d.types)    h += `<h3>Types of SSL We Offer</h3><p>${d.types}</p>`;
    if (d.features) {
      h += `<h3>Key Features</h3><ul class="feature-list">`;
      d.features.forEach(f => { h += `<li>${f}</li>`; });
      h += `</ul>`;
    }
    if (d.why)      h += `<h3>Why Choose GreenBD Cloud VPS?</h3><p>${d.why}</p>`;
    if (d.ownership) h += `<h3>${d.ownership}</h3><p>${d.ownershipText}</p>`;
    if (d.idealFor) {
      h += `<h3>${d.idealFor}</h3><ul class="feature-list">`;
      (d.idealList || []).forEach(i => { h += `<li>${i}</li>`; });
      h += `</ul>`;
    }
    if (d.support) h += `<h3>${d.support}</h3><p>${d.supportText}</p>`;
    if (d.closing) h += `<p class="closing-text">${d.closing}</p>`;
    h += `</div>`;
    if (d.image) h += `<div class="about-image"><img src="${d.image}" alt="${d.title}" loading="lazy"></div>`;
    return h;
  }
}
