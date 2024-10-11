import { DISABLED_ATTRIBUTE } from '../../util/Config.js';
import viewValidator from '../util/ViewValidator.js';

class PaginationView {
  #firstPageControl;
  #previousPageControl;
  #nextPageControl;
  #firstPageSelector = '.current__transactions-container';
  #previousPageSelector = '.btn__previous--page';
  #nextPageSelector = '.btn__next--page';
  #settingsFields = [
    'activateFirstPageControl',
    'activatePreviousPageControl',
    'activateNextPageControl',
  ];

  constructor() {
    this.#firstPageControl = document.querySelector(this.#firstPageSelector);
    this.#previousPageControl = document.querySelector(
      this.#previousPageSelector
    );
    this.#nextPageControl = document.querySelector(this.#nextPageSelector);

    this.#validateControlElements();
  }

  render(settings) {
    this.#validateSettings(settings);
    this.#renderElements(settings);
  }

  /**
   * HANDLERS
   */

  /**
   * Add click handler to the first page button.
   * @param {Function} handler - The event handler function.
   */
  addHandlerToFirstPageClick(handler) {
    this.#firstPageControl.addEventListener('click', handler);
  }

  /**
   * Add click handler to the previous page button.
   * @param {Function} handler - The event handler function.
   */
  addHandlerToPreviousPageClick(handler) {
    this.#previousPageControl.addEventListener('click', handler);
  }

  /**
   * Add click handler to the next page button.
   * @param {Function} handler - The event handler function.
   */
  addHandlerToNextPageClick(handler) {
    this.#nextPageControl.addEventListener('click', handler);
  }

  /**
   * PRIVATE METHODS
   */

  /**
   * Render elements based on settings.
   * @param {Object} settings - The settings for pagination.
   * @private
   */
  #renderElements(settings) {
    this.#activate(this.#firstPageControl, settings.activateFirstPageControl);
    this.#activate(
      this.#previousPageControl,
      settings.activatePreviousPageControl
    );
    this.#activate(this.#nextPageControl, settings.activateNextPageControl);
  }

  /**
   * Activate or deactivate an element based on isActive.
   * @param {HTMLElement} element - The DOM element to activate/deactivate.
   * @param {boolean} isActive - Activation status.
   * @private
   */
  #activate(element, isActive) {
    isActive
      ? element.classList.remove(DISABLED_ATTRIBUTE)
      : element.classList.add(DISABLED_ATTRIBUTE);
  }

  /**
   * VALIDATION
   */

  /**
   * Validate control elements exist in the DOM.
   * @private
   */
  #validateControlElements() {
    viewValidator.checkElementExists(
      this.#firstPageControl,
      this.#firstPageSelector
    );
    viewValidator.checkElementExists(
      this.#previousPageControl,
      this.#previousPageSelector
    );
    viewValidator.checkElementExists(
      this.#nextPageControl,
      this.#nextPageSelector
    );
  }

  /**
   * Validate the settings object.
   * @param {Object} settings - The settings object to validate.
   * @private
   */
  #validateSettings(settings) {
    this.#validateSettingsObject(settings);
    this.#settingsFields.forEach(field =>
      this.#validateSettingsField(settings, field)
    );
  }

  /**
   * Check if the settings object is valid.
   * @param {Object} settings - The settings object to validate.
   * @private
   */
  #validateSettingsObject(settings) {
    if (typeof settings !== 'object' || settings === null) {
      throw new Error(
        `Invalid data type. Expected an object. Received: ${settings} (type: ${typeof settings})`
      );
    }
  }

  /**
   * Validate a specific settings field.
   * @param {Object} settings - The settings object containing the field.
   * @param {string} field - The field to validate.
   * @private
   */
  #validateSettingsField(settings, field) {
    if (typeof settings[field] !== 'boolean') {
      throw new Error(
        `Invalid or missing field ${field}. Expected a boolean, received: ${
          settings[field]
        } (${typeof settings[field]}).`
      );
    }
  }
}

export default new PaginationView();
