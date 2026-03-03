/**
 * Footer — Renders the site footer.
 */
class Footer {
  /**
   * @param {HTMLElement} el          The <footer> element.
   * @param {string}      footerText  HTML/text content from DataStore.global.footer.
   */
  constructor(el, footerText) {
    this._el = el;
    this._text = footerText;
  }

  render() {
    this._el.innerHTML = `<div class="footer-inner">${this._text}</div>`;
  }
}
