import stateManager from '../../model/state/StateManager.js';
import overlayView from '../../view/page/OverlayView.js';
import { ACTIVE_CLASS } from '../../util/Config.js';

class ModalService {
  constructor() {
    overlayView.addHandlerOverlayClick(this.closeActiveModal);
  }

  /**
   * Opens the modal element passed as an argument, adds overlay and updates the state.
   * @param {HTMLElement} modalElement — Accepts an instance of HTMLElement.
   * @throws {Error} Throws an error if the provided value is not an HTMLElement.
   */
  openModal(modalElement) {
    if (!(modalElement instanceof HTMLElement)) {
      throw new Error(
        `The provided modalElement is not a valid HTMLElement. Received: ${modalElement} (type: ${typeof modalElement})`
      );
    }

    if (stateManager.getActiveModal()) {
      this.closeActiveModal();
    }
    overlayView.addOverlay();
    stateManager.setActiveModal(modalElement);
    modalElement.classList.add(ACTIVE_CLASS);
  }

  /**
   * Closes the currently active modal, hides the overlay and updates the state.
   */
  closeActiveModal() {
    const activeModal = stateManager.getActiveModal();
    if (!activeModal) return;
    overlayView.hideOverlay();
    activeModal.classList.remove(ACTIVE_CLASS);
    stateManager.setActiveModal(null);
  }
}

export default new ModalService();
