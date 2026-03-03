/**
 * HeroSlider — Auto-advancing hero banner slider.
 * Supports: fade transitions, pause on hover, keyboard navigation.
 */
class HeroSlider {
  static INTERVAL_MS = 4500;
  static TRANSITION_MS = 1200;

  /**
   * @param {HTMLElement} container  Element to render the slider into.
   * @param {Array}       slides     Array of { bgImage, title, description }.
   */
  constructor(container, slides) {
    this._container = container;
    this._slides = slides;
    this._currentIndex = 0;
    this._timer = null;
    this._transitioning = false;
  }

  /** Render markup and start the auto-advance timer. */
  render() {
    this._container.innerHTML = `
      <div class="hero-inner" role="region" aria-label="Featured banner">
        ${this._slides.map((slide, i) => `
          <div class="hero-slide ${i === 0 ? 'active' : ''}"
               style="background-image:url('${slide.bgImage}')"
               role="img"
               aria-label="${slide.title}">
            <div class="slide-content">
              <h1>${slide.title}</h1>
              <p>${slide.description}</p>
            </div>
          </div>
        `).join('')}
        <div class="hero-dots" role="tablist" aria-label="Slider navigation">
          ${this._slides.map((_, i) => `
            <button class="hero-dot ${i === 0 ? 'active' : ''}" role="tab"
                    aria-selected="${i === 0}" aria-label="Slide ${i + 1}"></button>
          `).join('')}
        </div>
      </div>
    `;

    this._slideEls = this._container.querySelectorAll('.hero-slide');
    this._dotEls = this._container.querySelectorAll('.hero-dot');

    this._attachListeners();
    this._start();
  }

  /** Stop auto-advance and clean up. */
  destroy() {
    this._stop();
    this._container.innerHTML = '';
  }

  // ─── Private ────────────────────────────────────────────────────────────────

  _start() {
    this._stop();
    this._timer = setInterval(() => this._advance(), HeroSlider.INTERVAL_MS);
  }

  _stop() {
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
  }

  _advance() {
    const next = (this._currentIndex + 1) % this._slides.length;
    this._goTo(next);
  }

  _goTo(index) {
    if (this._transitioning || index === this._currentIndex) return;
    this._transitioning = true;

    this._slideEls[this._currentIndex].classList.remove('active');
    this._dotEls[this._currentIndex].classList.remove('active');
    this._dotEls[this._currentIndex].setAttribute('aria-selected', 'false');

    this._currentIndex = index;
    this._slideEls[this._currentIndex].classList.add('active');
    this._dotEls[this._currentIndex].classList.add('active');
    this._dotEls[this._currentIndex].setAttribute('aria-selected', 'true');

    setTimeout(() => { this._transitioning = false; }, HeroSlider.TRANSITION_MS);
  }

  _attachListeners() {
    // Pause on hover
    this._container.addEventListener('mouseenter', () => this._stop());
    this._container.addEventListener('mouseleave', () => this._start());

    // Dot navigation
    this._dotEls.forEach((dot, i) => {
      dot.addEventListener('click', () => { this._goTo(i); this._start(); });
    });

    // Keyboard navigation (left/right arrows)
    this._container.setAttribute('tabindex', '0');
    this._container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { this._advance(); this._start(); }
      if (e.key === 'ArrowLeft') {
        const prev = (this._currentIndex - 1 + this._slides.length) % this._slides.length;
        this._goTo(prev); this._start();
      }
    });
  }
}
