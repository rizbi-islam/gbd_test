class Footer {
  constructor(el, text) {
    this._el   = el;
    this._text = text;
  }

  render() {
    this._el.innerHTML = `<div class="footer-inner">${this._text}</div>`;
  }
}
