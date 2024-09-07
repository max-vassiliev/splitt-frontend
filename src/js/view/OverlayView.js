import { HIDDEN_CLASS } from '../util/Config';

class OverlayView {
  #overlay;

  constructor() {
    this.#overlay = document.querySelector('.overlay');
  }

  addOverlay() {
    this.#overlay.classList.remove(HIDDEN_CLASS);
  }

  hideOverlay() {
    this.#overlay.classList.add(HIDDEN_CLASS);
  }

  addHandlerOverlayClick(handler) {
    this.#overlay.addEventListener('click', handler);
  }
}

export default new OverlayView();
