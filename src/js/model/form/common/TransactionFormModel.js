import { validateDate, isEmptyString } from '../../../util/SplittValidator.js';
import { TRANSACTION_NOTE_LIMIT } from '../../../util/Config.js';
import emojiManager from '../emoji/EmojiManager.js';
import dateManager from '../date/DateManager.js';

class TransactionFormModel {
  #manager;
  #transactionType;

  constructor(config) {
    const { manager, transactionType } = config;
    this.#manager = manager;
    this.#transactionType = transactionType;
  }

  // DATE

  /**
   * Updates the date in the active form after validating the input date string.
   *
   * @param {string} dateInput The date string to be set in the form.
   * @returns {Object} The response object.
   */
  updateDate = dateInput => {
    const rawDate = new Date(dateInput);
    const date = new Date(
      rawDate.getFullYear(),
      rawDate.getMonth(),
      rawDate.getDate()
    );
    this.#validateInputDate(date);
    return this.#manager.updateDate(date);
  };

  /**
   * Retrieves the updated date range and update status for the date input element.
   *
   * @returns {Object} An object containing the following properties:
   *   @property {string} min - The minimum transaction date as a string.
   *   @property {string} max - The maximum transaction date as a string.
   *   @property {boolean} updateDefaultDate - A flag indicating if the default date should be updated to today's date.
   */
  getDateInputUpdateData = () => {
    const {
      min: { string: min },
      max: { string: max },
    } = dateManager.getTransactionDateRange();
    const form = this.#manager.getActiveForm();
    let updateDefaultDate = false;
    if (form && !form.date) {
      updateDefaultDate = true;
    }
    return { min, max, updateDefaultDate };
  };

  /**
   * Validates the input date within the allowed date range.
   *
   * @param {Date} inputDate - The date to be validated.
   * @private
   */
  #validateInputDate = inputDate => {
    const {
      min: { date: minDate },
      max: { date: maxDate },
    } = dateManager.getTransactionDateRange();
    validateDate(inputDate, maxDate, minDate);
  };

  // EMOJI

  /**
   * Activates the emoji field for the transaction form.
   */
  activateEmojiField = () => {
    emojiManager.setActiveEmojiFieldId(this.#transactionType);
  };

  /**
   * Deactivates the active emoji field for the transaction form.
   */
  deactivateEmojiField = () => {
    emojiManager.clearActiveEmojiFieldId();
  };

  // NOTE

  /**
   * Updates the note in the active form and returns instructions for rendering.
   * Processes the input note to ensure it meets validation criteria.
   * If the note exceeds the character limit, no changes are made to the form.
   *
   * @param {string} noteInput - The note string to be set in the form. Can be an empty string or contain whitespace.
   * @returns {Object} - The validation result object containing the following properties:
   *   @property {boolean} isEmpty - Indicates if the input is an empty string or contains only whitespace.
   *   @property {boolean} shouldClear - Indicates if the input should be cleared.
   *   @property {number} count - The number of characters in the input.
   *   @property {boolean} isAboveLimit - Indicates if the number of characters exceeds the limit.
   */
  updateNote = noteInput => {
    const validationResult = this.#processNoteInput(noteInput);
    if (validationResult.isAboveLimit) return validationResult;
    const noteToSave = validationResult.isEmpty ? null : noteInput;
    const updateResult = this.#manager.updateNote(noteToSave);
    return { ...validationResult, ...updateResult };
  };

  /**
   * Processes the note input for a transaction form.
   * Validates the input note, checking for empty strings, whitespace, and length limits.
   *
   * @param {string} input - The input note string to be processed.
   * @returns {Object} - The result object containing the following properties:
   * @property {boolean} isEmpty - Indicates if the input is an empty string or contains only whitespace.
   * @property {number} count - The number of characters in the input.
   * @property {boolean} shouldClear - Indicates if the input should be cleared (i.e., it only contains whitespace).
   * @property {boolean} isAboveLimit - Indicates if the number of characters exceeds the limit defined in TRANSACTION_NOTE_LIMIT.
   */
  #processNoteInput = input => {
    let count = input.length;
    let shouldClear = false;
    const isEmpty = isEmptyString(input);
    if (isEmpty && count > 0) {
      shouldClear = true;
      count = 0;
    }
    const isAboveLimit = count > TRANSACTION_NOTE_LIMIT;

    return { isEmpty, count, shouldClear, isAboveLimit };
  };
}

export default TransactionFormModel;
