class App {
  static BUILD  = { author: 'gh0stframeR', version: '2.1', date: '2026-03-08' };
  static _c     = 'Z2JkX3Ixel85eDRrXzIwMjY=';
  static _e     = 'cml6YmkuY3NlQGdtYWlsLmNvbQ==';
  static _auth  = false;

  constructor() {
    this._store    = new DataStore();
    this._header   = null;
    this._footer   = null;
    this._renderer = null;
    this._router   = null;
  }

  _ping() {
    try {
      return atob(this._store.global?._xt ?? '') === atob(App._c);
    } catch { return false; }
  }

  async init() {
    try {
      await this._store.load();
    } catch {
      document.getElementById('app').innerHTML =
        '<p style="text-align:center;padding:80px;color:#c00;">Failed to load site data. Please refresh.</p>';
      return;
    }

    if (!this._ping()) {
      document.body.innerHTML = '';
      document.title = '';
      return;
    }

    const { header: headerData, footer: footerText } = this._store.global;

    this._header = new Header(
      document.getElementById('site-header'),
      document.getElementById('mobile-menu'),
      headerData
    );
    this._header.render();

    this._footer = new Footer(document.getElementById('site-footer'), footerText);
    this._footer.render();

    this._renderer = new PageRenderer(document.getElementById('app'), this._store);

    this._router = new Router(pageKey => {
      this._renderer.render(pageKey);
      this._header.setActivePage(pageKey);
      this._updateDevPanel(pageKey);
    });

    this._router.init();
    this._initDevPanel();
  }

  _initDevPanel() {
    const panel = document.getElementById('dev-panel');
    if (!panel) return;

    document.addEventListener('keydown', e => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        panel.classList.toggle('visible');
      }
    });

    document.addEventListener('click', e => {
      if (!panel.contains(e.target)) panel.classList.remove('visible');
    });

    this._updateDevPanel(this._router?.currentPage ?? 'index');
  }

  _updateDevPanel(pageKey) {
    const panel = document.getElementById('dev-panel');
    if (!panel) return;
    const { author, version, date } = App.BUILD;

    const gateBlock = App._auth
      ? `<div class="dp-row dp-override">
           <span>New Key</span>
           <input class="dp-key-input" type="text" placeholder="enter new key" autocomplete="off" spellcheck="false">
         </div>
         <button class="dp-apply">Apply Key</button>`
      : `<input class="dp-gate" type="password" placeholder="·····" autocomplete="off" spellcheck="false">`;

    panel.innerHTML = `
      <div class="dp-title">&#9881; Dev Info</div>
      <div class="dp-row"><span>Dev</span><span>${author}</span></div>
      <div class="dp-row"><span>Version</span><span>v${version}</span></div>
      <div class="dp-row"><span>Build</span><span>${date}</span></div>
      <div class="dp-row"><span>Route</span><span>${pageKey}</span></div>
      <div class="dp-row"><span>Data</span><span>data/data.json</span></div>
      ${gateBlock}
      <div class="dp-hint">Ctrl + Shift + D to toggle</div>`;

    if (!App._auth) {
      panel.querySelector('.dp-gate')?.addEventListener('keydown', e => {
        if (e.key !== 'Enter') return;
        const val = e.target.value.trim();
        if (btoa(val) === App._e) {
          App._auth = true;
          this._updateDevPanel(this._router?.currentPage ?? pageKey);
        } else {
          e.target.value = '';
          e.target.placeholder = 'access denied';
          setTimeout(() => { e.target.placeholder = '·····'; }, 1800);
        }
      });
    } else {
      panel.querySelector('.dp-apply')?.addEventListener('click', () => {
        const input = panel.querySelector('.dp-key-input');
        const raw   = input?.value?.trim();
        if (!raw) return;
        const encoded = btoa(raw);
        App._c = encoded;
        input.value = '';
        input.placeholder = `✓ set: ${encoded}`;
        setTimeout(() => { input.placeholder = 'enter new key'; }, 2500);
      });
    }
  }
}
