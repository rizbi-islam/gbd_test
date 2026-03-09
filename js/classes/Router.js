class Router {
  static ROUTES = new Map([
    ['',           'index'],
    ['/',          'index'],
    ['/about',     'about-us'],
    ['/about-us',  'about-us'],
    ['/hosting',    'hosting'],
    ['/ssl',       'ssl'],
    ['/zimbra',    'zimbra'],
    ['/domain',    'domain'],
    ['/cloud',     'cloud'],
    ['/onpremise', 'onpremise'],
  ]);

  constructor(onNavigate) {
    this._onNavigate  = onNavigate;
    this._currentPage = null;
    this._handleHashChange = this._handleHashChange.bind(this);
  }

  init() {
    window.addEventListener('hashchange', this._handleHashChange);
    this._resolve();
  }

  destroy() {
    window.removeEventListener('hashchange', this._handleHashChange);
  }

  get currentPage() { return this._currentPage; }

  _handleHashChange() { this._resolve(); }

  _resolve() {
    const hash    = window.location.hash || '#/';
    const segment = hash.startsWith('#') ? hash.slice(1) : hash;
    const pageKey = Router.ROUTES.get(segment) ?? 'index';
    if (pageKey === this._currentPage) return;
    this._currentPage = pageKey;
    this._onNavigate(pageKey);
  }
}
