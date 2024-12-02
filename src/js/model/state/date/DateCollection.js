import DateState from './DateState.js';

class DateCollection {
  #today;
  #minTransactionDate;

  static DATES = {
    TODAY: 'today',
    MIN_TRANSACTION_DATE: 'minTransactionDate',
  };

  /**
   * Gets the 'today' date state.
   *
   * @returns {DateState} The current 'today' date state.
   */
  get today() {
    return this.#today;
  }

  /**
   * Sets the 'today' date state.
   *
   * @param {DateState} value - The new DateState for 'today'.
   * @throws {Error} Throws an error if value is not a DateState instance.
   */
  set today(value) {
    this.#validateDateState(value);
    this.#today = value;
  }

  /**
   * Gets the 'minTransactionDate' date state.
   *
   * @returns {DateState} The current 'minTransactionDate' date state.
   */
  get minTransactionDate() {
    return this.#minTransactionDate;
  }

  /**
   * Sets the 'minTransactionDate' date state.
   *
   * @param {DateState} value - The new DateState for 'minTransactionDate'.
   * @throws {Error} Throws an error if value is not a DateState instance.
   */
  set minTransactionDate(value) {
    this.#validateDateState(value);
    this.#minTransactionDate = value;
  }

  /**
   * Validates that the provided value is an instance of {@link DateState}.
   *
   * @param {*} value - The value to validate.
   * @throws {Error} Throws an error if value is not a DateState instance.
   * @private
   */
  #validateDateState(value) {
    if (!(value instanceof DateState)) {
      throw new Error('Invalid value: must be an instance of DateState');
    }
  }
}

export default new DateCollection();
export const { DATES } = DateCollection;
