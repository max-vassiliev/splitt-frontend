import modalView from '../../view/page/ModalView.js';
import overlayView from '../../view/page/OverlayView.js';
import pageModel from '../../model/page/PageModel.js';

class ModalController {
  init = () => {
    overlayView.addHandlerOverlayClick(this.closeActiveModal);
  };

  /**
   * Opens the modal with the given ID, adds overlay, and updates the active modal ID in the model.
   * @param {string} modalId - The ID of the modal to open.
   * @throws {Error} Throws an error if modalId is not provided or invalid.
   */
  openModal = modalId => {
    modalView.openModal(modalId);
    overlayView.addOverlay();
    pageModel.setActiveModalId(modalId);
  };

  /**
   * Closes the currently active modal, hides the overlay, and clears the active modal ID in the model.
   * @throws {Error} Throws an error if there is no active modal ID.
   */
  closeActiveModal = () => {
    const activeModalId = pageModel.getActiveModalId();
    modalView.closeModal(activeModalId);
    overlayView.hideOverlay();
    pageModel.closeActiveModal();
  };
}

export default new ModalController();
