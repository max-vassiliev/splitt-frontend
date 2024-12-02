import { isEmptyString } from '../../util/SplittValidator.js';
import { TRANSACTION_NOTE_LIMIT } from '../../util/Config.js';

class TransactionFormService {
  /**
   * Processes the note input for a transaction form.
   * Validates the input note, checking for empty strings, whitespace, and length limits.
   *
   * @param {string} input - The input note string to be processed.
   * @returns {Object} - The result object containing the following properties:
   *   @property {boolean} isEmpty - Indicates if the input is an empty string or contains only whitespace.
   *   @property {number} count - The number of characters in the input.
   *   @property {boolean} shouldClear - Indicates if the input should be cleared (i.e., it only contains whitespace).
   *   @property {boolean} isAboveLimit - Indicates if the number of characters exceeds the limit defined in TRANSACTION_NOTE_LIMIT.
   */
  processNoteInput = input => {
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

export default new TransactionFormService();
