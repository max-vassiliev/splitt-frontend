import { EXPENSE_SPLITT_TYPES } from '../../../../util/Config.js';

class ExpenseSplittState {
  _type;
  _isValid;
  _isInitialized;

  constructor(type) {
    this.#validateType(type);
    this._type = type;
    this._isValid = false;
    this._isInitialized = false;
  }

  /**
   * Gets the expense splitt type.
   * @returns {string} The splitt type.
   */
  get type() {
    return this._type;
  }

  /**
   * Gets the "isValid" flag, which shows if the form is ready to be submitted.
   * @returns {boolean} `true` if valid or `false` if not.
   */
  get isValid() {
    return this._isValid;
  }

  /**
   * Gets the "isInitialized" flag, which shows if the form has been initialized.
   * @returns {boolean} `true` if initialized or `false` if not.
   */
  get isInitialized() {
    return this._isInitialized;
  }

  /**
   * Validates the expense splitt type.
   * @param {string} type Must be a string defined in [EXPENSE_SPLITT_TYPES]{@link EXPENSE_SPLITT_TYPES}.
   * @throws {Error} If the incoming type is not one of the valid strings.
   * @see {@link EXPENSE_SPLITT_TYPES}
   */
  #validateType(type) {
    if (!EXPENSE_SPLITT_TYPES.has(type)) {
      const validTypes = [...EXPENSE_SPLITT_TYPES].join(', ');
      throw new Error(
        `Invalid Expense Splitt type: ${type} (${typeof type}). Expected one of the following types: ${validTypes}.`
      );
    }
  }
}

export default ExpenseSplittState;
