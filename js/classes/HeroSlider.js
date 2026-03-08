class HeroSlider {
  static INTERVAL_MS   = 4500;
  static TRANSITION_MS = 1200;

  constructor(container, slides) {
    this._container   = container;
    this._slides      = slides;
    this._index       = 0;
    this._timer       = null;
    this._transitioning = false;
  }

  render() {
    this._container.innerHTML = `
      <div class="hero-inner">
        ${this._slides.map((s, i) => `
          <div class="hero-slide ${i === 0 ? 'active' : ''}"
               style="background-image:url('${s.bgImage}')"
               aria-label="${s.title}">
            <div class="slide-content">
              <h1>${s.title}</h1>
              <p>${s.description}</p>
            </div>
          </div>`).join('')}
        <div class="hero-dots">
          ${this._slides.map((_, i) => `
            <button class="hero-dot ${i === 0 ? 'active' : ''}"
                    aria-label="Slide ${i + 1}"></button>`).join('')}
        </div>
      </div>`;

    this._slideEls = this._container.querySelectorAll('.hero-slide');
    this._dotEls   = this._container.querySelectorAll('.hero-dot');
    this._bindEvents();
    this._start();
  }

  destroy() {
    this._stop();
    this._container.innerHTML = '';
  }

  _start() {
    this._stop();
    this._timer = setInterval(() => this._next(), HeroSlider.INTERVAL_MS);
  }

  _stop() {
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
  }

  _next() { this._goTo((this._index + 1) % this._slides.length); }

  _goTo(idx) {
    if (this._transitioning || idx === this._index) return;
    this._transitioning = true;
    this._slideEls[this._index].classList.remove('active');
    this._dotEls[this._index].classList.remove('active');
    this._index = idx;
    this._slideEls[this._index].classList.add('active');
    this._dotEls[this._index].classList.add('active');
    setTimeout(() => { this._transitioning = false; }, HeroSlider.TRANSITION_MS);
  }

  _bindEvents() {
    this._container.addEventListener('mouseenter', () => this._stop());
    this._container.addEventListener('mouseleave', () => this._start());
    this._dotEls.forEach((dot, i) => {
      dot.addEventListener('click', () => { this._goTo(i); this._start(); });
    });
    this._container.setAttribute('tabindex', '0');
    this._container.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { this._next(); this._start(); }
      if (e.key === 'ArrowLeft')  { this._goTo((this._index - 1 + this._slides.length) % this._slides.length); this._start(); }
    });
  }
}
