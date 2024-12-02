import { MODAL_IDS, ACTIVE_CLASS } from '../../util/Config.js';

class ModalView {
  #modals;

  constructor() {
    this.#modals = new Map();
  }

  /**
   * Registers a modal in the modals map.
   *
   * @param {number} modalId  The ID of the modal to load. Must be on of {@link MODAL_IDS}.
   * @param {HTMLElement} modalElement The HTML element representing the modal.
   * @throws {Error} Throws an error if any of the parameters is invalid.
   */
  registerModal = (modalId, modalElement) => {
    if (!MODAL_IDS.has(modalId)) {
      throw new Error(
        `Invalid modal ID. Expected one of: ${[...MODAL_IDS].join(
          ', '
        )}. Received: ${modalId} (type: ${typeof modalId}).`
      );
    }
    if (!(modalElement instanceof HTMLElement)) {
      throw new Error(
        `Invalid modal element. Expected an HTMLElement. Received: ${modalElement} (type: ${typeof modalElement}).`
      );
    }
    this.#modals.set(modalId, modalElement);
  };

  /**
   * Opens the modal with the given ID by adding the {@link ACTIVE_CLASS}.
   * @param {number} modalId - The ID of the modal to open.
   */
  openModal = modalId => {
    const modalElement = this.#getModalElementById(modalId);
    modalElement.classList.add(ACTIVE_CLASS);
  };

  /**
   * Closes the modal with the given ID by removing the {@link ACTIVE_CLASS}.
   * @param {number} modalId - The ID of the modal to close.
   */
  closeModal = modalId => {
    const modalElement = this.#getModalElementById(modalId);
    modalElement.classList.remove(ACTIVE_CLASS);
  };

  /**
   * Retrieves the modal element by ID and validates its existence.
   *
   * @param {number} modalId The ID of the modal to retrieve.
   * @returns {HTMLElement} The modal element associated with the given ID.
   * @throws {Error} Throws an error if no modal is registered with the given ID.
   */
  #getModalElementById = modalId => {
    const modalElement = this.#modals.get(modalId);
    if (!modalElement) {
      throw new Error(`No modal registered with ID: ${modalId}.`);
    }
    return modalElement;
  };
}

export default new ModalView();
