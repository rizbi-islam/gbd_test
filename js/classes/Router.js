/**
 * Router — Hash-based SPA router.
 * Maps URL hashes to named page keys used by DataStore & PageRenderer.
 *
 * Routes:
 *   #/          → index
 *   #/about     → about-us
 *   #/shared    → shared
 *   #/ssl       → ssl
 *   #/zimbra    → zimbra
 *   #/domain    → domain
 *   #/cloud     → cloud
 *   #/onpremise → onpremise
 */
class Router {
  /** @type {Map<string, string>} hash segment → data page key */
  static ROUTES = new Map([
    ['',           'index'],
    ['/',          'index'],
    ['/about',     'about-us'],
    ['/about-us',  'about-us'],
    ['/shared',    'shared'],
    ['/ssl',       'ssl'],
    ['/zimbra',    'zimbra'],
    ['/domain',    'domain'],
    ['/cloud',     'cloud'],
    ['/onpremise', 'onpremise'],
  ]);

  /**
   * @param {Function} onNavigate  Callback(pageKey) invoked on route change.
   */
  constructor(onNavigate) {
    this._onNavigate = onNavigate;
    this._currentPage = null;
    this._handleHashChange = this._handleHashChange.bind(this);
  }

  /** Register event listeners and resolve the initial route. */
  init() {
    window.addEventListener('hashchange', this._handleHashChange);
    this._resolve();
  }

  /** Clean up event listeners. */
  destroy() {
    window.removeEventListener('hashchange', this._handleHashChange);
  }

  /**
   * Programmatically navigate to a route.
   * @param {string} hash  e.g. "#/about"
   */
  navigate(hash) {
    window.location.hash = hash;
  }

  /** @returns {string} Current page key. */
  get currentPage() { return this._currentPage; }

  // ─── Private ────────────────────────────────────────────────────────────────

  _handleHashChange() { this._resolve(); }

  _resolve() {
    const hash = window.location.hash || '#/';
    const segment = hash.startsWith('#') ? hash.slice(1) : hash;
    const pageKey = Router.ROUTES.get(segment) ?? 'index';

    if (pageKey === this._currentPage) return; // no-op on same page
    this._currentPage = pageKey;
    this._onNavigate(pageKey);
  }
}
