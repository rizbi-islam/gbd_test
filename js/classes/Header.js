/**
 * Header — Renders and manages the sticky navigation header.
 * Handles: logo, desktop nav, dropdown menus, mobile hamburger menu.
 */
class Header {
  /**
   * @param {HTMLElement} el         The <header> element to render into.
   * @param {HTMLElement} mobileEl   The mobile menu overlay element.
   * @param {Object}      headerData Data from DataStore.global.header
   */
  constructor(el, mobileEl, headerData) {
    this._el = el;
    this._mobileEl = mobileEl;
    this._data = headerData;
    this._menuOpen = false;
  }

  /** Build and inject the header HTML, attach listeners. */
  render() {
    this._el.innerHTML = this._buildDesktopHeader();
    this._mobileEl.innerHTML = this._buildMobileMenu();
    this._attachListeners();
  }

  /**
   * Highlight the active nav item.
   * @param {string} pageKey  Current page key from Router.
   */
  setActivePage(pageKey) {
    this._el.querySelectorAll('.nav-link, .dropdown-item').forEach(a => {
      a.classList.remove('active');
      if (a.dataset.page === pageKey) a.classList.add('active');
    });
    this._mobileEl.querySelectorAll('.mob-link').forEach(a => {
      a.classList.remove('active');
      if (a.dataset.page === pageKey) a.classList.add('active');
    });
  }

  // ─── Private builders ───────────────────────────────────────────────────────

  _buildDesktopHeader() {
    const { logo, logoText, nav } = this._data;
    return `
      <div class="header-inner">
        <div class="header-left">
          <a href="#/" class="logo-link">
            <img src="${logo}" class="logo-img" alt="GreenBD Logo">
            <img src="${logoText}" class="logo-img second-logo" alt="GreenBD">
          </a>
        </div>
        <nav class="nav-links" role="navigation" aria-label="Main navigation">
          ${nav.map(item => this._buildNavItem(item)).join('')}
        </nav>
        <button class="hamburger" aria-label="Toggle menu" aria-expanded="false" aria-controls="mobile-menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    `;
  }

  _buildNavItem(item) {
    if (item.dropdown) {
      return `
        <div class="dropdown" role="none">
          <button class="nav-link dropdown-toggle" aria-haspopup="true" aria-expanded="false">
            ${item.text} <span class="chevron" aria-hidden="true">▾</span>
          </button>
          <div class="dropdown-content" role="menu">
            ${item.dropdown.map(sub => `
              <a href="${sub.url}" class="dropdown-item" role="menuitem"
                 data-page="${this._urlToPageKey(sub.url)}">${sub.text}</a>
            `).join('')}
          </div>
        </div>
      `;
    }
    return `<a href="${item.url}" class="nav-link" data-page="${this._urlToPageKey(item.url)}">${item.text}</a>`;
  }

  _buildMobileMenu() {
    const { nav } = this._data;
    const allLinks = [];
    nav.forEach(item => {
      if (item.dropdown) {
        item.dropdown.forEach(sub => allLinks.push({ text: sub.text, url: sub.url }));
      } else {
        allLinks.push({ text: item.text, url: item.url });
      }
    });
    return `
      <button class="mob-close" aria-label="Close menu">✕</button>
      <nav class="mob-nav">
        ${allLinks.map(link => `
          <a href="${link.url}" class="mob-link" data-page="${this._urlToPageKey(link.url)}">${link.text}</a>
        `).join('')}
      </nav>
    `;
  }

  _attachListeners() {
    // Hamburger toggle
    const hamburger = this._el.querySelector('.hamburger');
    hamburger?.addEventListener('click', () => this._toggleMobile(true));

    // Mobile close button
    const closeBtn = this._mobileEl.querySelector('.mob-close');
    closeBtn?.addEventListener('click', () => this._toggleMobile(false));

    // Close mobile menu on link click
    this._mobileEl.querySelectorAll('.mob-link').forEach(a => {
      a.addEventListener('click', () => this._toggleMobile(false));
    });

    // Close mobile on overlay click (outside menu)
    this._mobileEl.addEventListener('click', (e) => {
      if (e.target === this._mobileEl) this._toggleMobile(false);
    });

    // Desktop dropdown: close when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown')) {
        this._el.querySelectorAll('.dropdown-content').forEach(d => d.classList.remove('open'));
        this._el.querySelectorAll('.dropdown-toggle').forEach(b => b.setAttribute('aria-expanded', 'false'));
      }
    });

    // Desktop dropdown toggle
    this._el.querySelectorAll('.dropdown-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const content = btn.nextElementSibling;
        const isOpen = content.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen);
      });
    });
  }

  _toggleMobile(open) {
    this._menuOpen = open;
    this._mobileEl.classList.toggle('open', open);
    this._mobileEl.setAttribute('aria-hidden', !open);
    document.body.classList.toggle('menu-open', open);
    const hamburger = this._el.querySelector('.hamburger');
    hamburger?.classList.toggle('active', open);
    hamburger?.setAttribute('aria-expanded', open);
  }

  /** Convert a URL (#/page or page.html) to a page key for active state matching. */
  _urlToPageKey(url) {
    if (url.startsWith('#/')) {
      const seg = url.slice(2) || 'index';
      const map = { '': 'index', 'about': 'about-us', 'shared': 'shared', 'ssl': 'ssl',
                    'zimbra': 'zimbra', 'domain': 'domain', 'cloud': 'cloud', 'onpremise': 'onpremise' };
      return map[seg] ?? seg;
    }
    return url.replace('.html', '').replace('./', '') || 'index';
  }
}
