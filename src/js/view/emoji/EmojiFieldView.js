import EmojiField from './EmojiField.js';
import { TRANSACTION_TYPES } from '../../util/Config.js';
import { toggleEmojiInputField } from '../util/RenderHelper.js';
import { isActive, isNonEmptyString } from '../../util/SplittValidator.js';

class EmojiFieldView {
  #emojiFields;

  constructor() {
    this.#emojiFields = new Map();
  }

  /**
   * Registers an emoji field.
   * @param {Object} emojiFieldData The data for the emoji field.
   * @param {string} emojiFieldData.formType The type of the form, one of {@link TRANSACTION_TYPES}.
   * @throws {Error} If the ID is invalid.
   * @see {@link EmojiField}
   */
  registerEmojiField = emojiFieldData => {
    const id = emojiFieldData.formType;
    this.#validateId(id);
    const emojiField = new EmojiField(emojiFieldData);
    this.#emojiFields.set(id, emojiField);
  };

  /**
   * Selects an emoji for a given field ID and sets it in the input field.
   * @param {string} fieldId The ID of the field. One of {@link TRANSACTION_TYPES}.
   * @param {string} emoji The emoji to select.
   * @throws {Error} If no emoji field is registered with the given ID.
   */
  selectEmoji = (fieldId, emoji) => {
    const emojiField = this.#getEmojiFieldById(fieldId);
    emojiField.inputField.value = emoji;
    this.#activateInputField(emojiField);
  };

  /**
   * Removes the selected emoji from the input field for the given field ID.
   * @param {string} fieldId The ID of the field. One of {@link TRANSACTION_TYPES}.
   * @throws {Error} If no emoji field is registered with the given ID.
   */
  removeEmoji = fieldId => {
    const emojiField = this.#getEmojiFieldById(fieldId);
    emojiField.inputField.value = '';
    this.#deactivateInputField(emojiField);
  };

  /**
   * Gets the top margin of the emoji container for the given field ID.
   * @param {string} fieldId The ID of the field. One of {@link TRANSACTION_TYPES}.
   * @returns {string} The top margin of the emoji container.
   * @throws {Error} If no emoji field is registered with the given ID.
   */
  getTopMargin = fieldId => {
    const emojiField = this.#getEmojiFieldById(fieldId);
    return emojiField.topMargin;
  };

  /**
   * Sets the top margin of the emoji container for the given field ID.
   * @param {string} fieldId The ID of the field. One of {@link TRANSACTION_TYPES}.
   * @param {string} value The value to set as the top margin.
   * @throws {Error} If the value is not a non-empty string.
   * @throws {Error} If no emoji field is registered with the given ID.
   */
  setTopMargin = (fieldId, value) => {
    if (!isNonEmptyString(value)) {
      throw new Error(
        `Invalid value for emoji container top margin: expected a non-empty string. Received: ${value} (type: ${typeof value}).`
      );
    }
    const emojiField = this.#getEmojiFieldById(fieldId);
    emojiField.topMargin = value;
  };

  /**
   * Activates the input field and related buttons for the given emoji field.
   * @param {EmojiField} emojiField The emoji field object.
   * @private
   */
  #activateInputField = emojiField => {
    if (isActive(emojiField.inputField)) return;
    toggleEmojiInputField(emojiField);
  };

  /**
   * Deactivates the input field and related buttons for the given emoji field.
   * @param {EmojiField} emojiField The emoji field object.
   * @private
   */
  #deactivateInputField = emojiField => {
    toggleEmojiInputField(emojiField, false);
  };

  /**
   * Gets the emoji field object for the given field ID.
   * @param {string} fieldId The ID of the field. One of {@link TRANSACTION_TYPES}.
   * @returns {EmojiField} The emoji field object.
   * @throws {Error} If no emoji field is registered with the given ID.
   * @private
   */
  #getEmojiFieldById = fieldId => {
    const emojiField = this.#emojiFields.get(fieldId);
    if (!emojiField) {
      throw new Error(`No emoji field registered with ID: ${fieldId}`);
    }
    return emojiField;
  };

  /**
   * Validates if the transaction type is one of the types defined in {@link TRANSACTION_TYPES}.
   * @param {string} id - The ID to validate.
   * @throws {Error} If the Id is invalid.
   */
  #validateId = id => {
    if (!TRANSACTION_TYPES.has(id)) {
      throw new Error(
        `Invalid emoji field ID: "${id}" (${typeof id}). Expected one of: ${Array.from(
          TRANSACTION_TYPES
        ).join(', ')}.`
      );
    }
  };
}

export default new EmojiFieldView();
