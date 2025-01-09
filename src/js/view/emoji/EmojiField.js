import {
  isNonEmptyString,
  validateTransactionType,
} from '../../util/SplittValidator.js';
import { TRANSACTION_TYPES } from '../../util/Config.js';

class EmojiField {
  #formType;
  #inputField;
  #defaultBtn;
  #pickerSwitchBtn;
  #removeBtn;
  #topMargin;

  constructor(data) {
    this.inputField = data.inputField;
    this.defaultBtn = data.defaultBtn;
    this.pickerSwitchBtn = data.pickerSwitchBtn;
    this.removeBtn = data.removeBtn;
    this.formType = data.formType;
  }

  /**
   * Gets the form type of the emoji field.
   * @returns {string} The transaction type, one of [TRANSACTION_TYPES]{@link TRANSACTION_TYPES}.
   */
  get formType() {
    return this.#formType;
  }

  /**
   * Sets the form type of the emoji field.
   * @param {string} value Must be a string defined in [TRANSACTION_TYPES]{@link TRANSACTION_TYPES}.
   * @throws {Error} If the value is not one of [TRANSACTION_TYPES]{@link TRANSACTION_TYPES}.
   */
  set formType(value) {
    validateTransactionType(value);
    this.#formType = value;
  }

  /**
   * Gets the input field element.
   * @returns {HTMLElement} The input field element.
   */
  get inputField() {
    return this.#inputField;
  }

  /**
   * Sets the input field element.
   * @param {HTMLElement} value The input field element.
   * @throws {Error} If the value is not a valid HTMLElement.
   */
  set inputField(value) {
    if (!(value instanceof HTMLElement)) {
      throw new Error(
        `Invalid value for inputField: expected an HTMLElement. Received: ${value} (type: ${typeof value}).`
      );
    }
    this.#inputField = value;
  }

  /**
   * Gets the default button element.
   * @returns {HTMLElement} The default button element.
   */
  get defaultBtn() {
    return this.#defaultBtn;
  }

  /**
   * Sets the default button element.
   * @param {HTMLElement} value The default button element.
   * @throws {Error} If the value is not a valid HTMLElement.
   */
  set defaultBtn(value) {
    if (!(value instanceof HTMLElement)) {
      throw new Error(
        `Invalid value for defaultBtn: expected an HTMLElement. Received: ${value} (type: ${typeof value}).`
      );
    }
    this.#defaultBtn = value;
  }

  /**
   * Gets the picker switch button element.
   * @returns {HTMLElement} The picker switch button element.
   */
  get pickerSwitchBtn() {
    return this.#pickerSwitchBtn;
  }

  /**
   * Sets the picker switch button element.
   * @param {HTMLElement} value The picker switch button element.
   * @throws {Error} If the value is not a valid HTMLElement.
   */
  set pickerSwitchBtn(value) {
    if (!(value instanceof HTMLElement)) {
      throw new Error(
        `Invalid value for pickerSwitchBtn: expected an HTMLElement. Received: ${value} (type: ${typeof value}).`
      );
    }
    this.#pickerSwitchBtn = value;
  }

  /**
   * Gets the remove button element.
   * @returns {HTMLElement} The remove button element.
   */
  get removeBtn() {
    return this.#removeBtn;
  }

  /**
   * Sets the remove button element.
   * @param {HTMLElement} value The remove button element.
   * @throws {Error} If the value is not a valid HTMLElement.
   */
  set removeBtn(value) {
    if (!(value instanceof HTMLElement)) {
      throw new Error(
        `Invalid value for removeBtn: expected an HTMLElement. Received: ${value} (type: ${typeof value}).`
      );
    }
    this.#removeBtn = value;
  }

  /**
   * Gets the top margin of the emoji container.
   * @returns {string} The margin in pixels.
   */
  get topMargin() {
    return this.#topMargin;
  }

  /**
   * Sets the top margin of the emoji container.
   * @param {string} value The margin in pixels.
   * @throws {Error} If the value is not a non-empty string.
   */
  set topMargin(value) {
    if (!isNonEmptyString(value)) {
      throw new Error(
        `Invalid value for topMargin: expected a non-empty string. Received: ${value} (type: ${typeof value}).`
      );
    }
    this.#topMargin = value;
  }
}

export default EmojiField;
