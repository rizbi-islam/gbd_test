/**
 * App — Top-level orchestrator. Composes and wires all subsystems:
 *   DataStore → loads data
 *   Header    → renders persistent navigation
 *   Footer    → renders persistent footer
 *   Router    → listens for hash changes
 *   PageRenderer → renders the correct page view per route
 *
 * Usage: const app = new App(); app.init();
 */
class App {
  constructor() {
    this._store   = new DataStore();
    this._header  = null;
    this._footer  = null;
    this._renderer = null;
    this._router  = null;
  }

  /**
   * Bootstrap the application:
   * 1. Load data
   * 2. Instantiate and render persistent chrome (header, footer)
   * 3. Wire router → page renderer
   */
  async init() {
    try {
      await this._store.load('data/data.json');
    } catch {
      document.getElementById('app').innerHTML =
        '<p style="text-align:center;padding:80px;color:#c00;">Failed to load site data. Please refresh.</p>';
      return;
    }

    const { header: headerData, footer: footerText } = this._store.global;

    // Persistent UI
    this._header = new Header(
      document.getElementById('site-header'),
      document.getElementById('mobile-menu'),
      headerData
    );
    this._header.render();

    this._footer = new Footer(document.getElementById('site-footer'), footerText);
    this._footer.render();

    // Page rendering
    this._renderer = new PageRenderer(document.getElementById('app'), this._store);

    // Router — on every navigation, render page + update active nav
    this._router = new Router((pageKey) => {
      this._renderer.render(pageKey);
      this._header.setActivePage(pageKey);
    });

    this._router.init();
  }
}
