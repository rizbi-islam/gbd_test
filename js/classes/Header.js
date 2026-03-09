class Header {
  constructor(el, mobileEl, headerData) {
    this._el       = el;
    this._mobileEl = mobileEl;
    this._data     = headerData;
  }

  render() {
    this._el.innerHTML       = this._buildDesktop();
    this._mobileEl.innerHTML = this._buildMobile();
    this._bindEvents();
  }

  setActivePage(pageKey) {
    this._el.querySelectorAll('[data-page]').forEach(a => {
      a.classList.toggle('active', a.dataset.page === pageKey);
    });
    this._mobileEl.querySelectorAll('[data-page]').forEach(a => {
      a.classList.toggle('active', a.dataset.page === pageKey);
    });
  }

  _urlToKey(url) {
    const seg = url.startsWith('#/') ? url.slice(2) : url.replace('.html', '').replace('./', '');
    const map = { '': 'index', 'about': 'about-us', 'about-us': 'about-us',
                  'hosting': 'hosting', 'ssl': 'ssl', 'zimbra': 'zimbra',
                  'domain': 'domain', 'cloud': 'cloud', 'onpremise': 'onpremise' };
    return map[seg] ?? 'index';
  }

  _buildDesktop() {
    const { logo, logoText, nav } = this._data;
    const navHtml = nav.map(item => {
      if (item.dropdown) {
        const items = item.dropdown.map(s =>
          `<a href="${s.url}" class="dropdown-item" data-page="${this._urlToKey(s.url)}">${s.text}</a>`
        ).join('');
        return `<div class="dropdown">
          <button class="nav-link dropdown-toggle" aria-haspopup="true" aria-expanded="false">
            ${item.text} <span class="chevron" aria-hidden="true">&#9660;</span>
          </button>
          <div class="dropdown-content">${items}</div>
        </div>`;
      }
      return `<a href="${item.url}" class="nav-link" data-page="${this._urlToKey(item.url)}">${item.text}</a>`;
    }).join('');

    return `<div class="header-inner">
      <a href="#/" class="logo-link">
        <img src="${logo}" class="logo-img" alt="GreenBD">
        <img src="${logoText}" class="logo-img second-logo" alt="GreenBD Hosting">
      </a>
      <nav class="nav-links" aria-label="Main navigation">${navHtml}</nav>
      <button class="hamburger" aria-label="Open menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>`;
  }

  _buildMobile() {
    const links = [];
    this._data.nav.forEach(item => {
      if (item.dropdown) {
        item.dropdown.forEach(s => links.push(s));
      } else {
        links.push(item);
      }
    });
    const linksHtml = links.map(l =>
      `<a href="${l.url}" class="mob-link" data-page="${this._urlToKey(l.url)}">${l.text}</a>`
    ).join('');
    return `<button class="mob-close" aria-label="Close menu">&#x2715;</button>
      <nav class="mob-nav">${linksHtml}</nav>`;
  }

  _bindEvents() {
    this._el.querySelector('.hamburger')
      ?.addEventListener('click', () => this._toggleMobile(true));
    this._mobileEl.querySelector('.mob-close')
      ?.addEventListener('click', () => this._toggleMobile(false));
    this._mobileEl.querySelectorAll('.mob-link')
      .forEach(a => a.addEventListener('click', () => this._toggleMobile(false)));

    this._el.querySelectorAll('.dropdown-toggle').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const menu   = btn.nextElementSibling;
        const isOpen = menu.classList.toggle('open');
        btn.setAttribute('aria-expanded', isOpen);
        this._el.querySelectorAll('.dropdown-content').forEach(m => {
          if (m !== menu) { m.classList.remove('open'); m.previousElementSibling?.setAttribute('aria-expanded', 'false'); }
        });
      });
    });

    document.addEventListener('click', () => {
      this._el.querySelectorAll('.dropdown-content').forEach(m => {
        m.classList.remove('open');
        m.previousElementSibling?.setAttribute('aria-expanded', 'false');
      });
    });
  }

  _toggleMobile(open) {
    this._mobileEl.classList.toggle('open', open);
    this._mobileEl.setAttribute('aria-hidden', !open);
    document.body.classList.toggle('menu-open', open);
    const ham = this._el.querySelector('.hamburger');
    ham?.classList.toggle('active', open);
    ham?.setAttribute('aria-expanded', open);
  }
}
