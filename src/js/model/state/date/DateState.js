class DateState {
  #date;
  #string;

  constructor(dateValue) {
    this.date = dateValue;
  }

  /**
   * Sets the date and updates the corresponding string representation.
   *
   * @param {Date} dateValue - The Date object to set.
   * @throws {Error} Throws an error if dateValue is not a valid Date instance.
   */
  set date(dateValue) {
    this.#validateDate(dateValue);
    this.#date = dateValue;
    this.#string = this.#convertToString(dateValue);
  }

  /**
   * Gets the stored Date object.
   *
   * @returns {Date} The current Date object.
   */
  get date() {
    return this.#date;
  }

  /**
   * Gets the string representation of the stored date.
   *
   * @returns {string} The formatted date string in "YYYY-MM-DD" format.
   */
  get string() {
    return this.#string;
  }

  /**
   * Validates that the provided value is a valid Date instance.
   *
   * @param {any} value - The value to validate as a Date instance.
   * @throws {Error} Throws an error if the value is not a valid Date instance.
   */
  #validateDate = dateValue => {
    if (!(dateValue instanceof Date)) {
      throw new Error(
        `Invalid date. Expected an instance of Date. Received: ${dateValue} (${typeof dateValue}).`
      );
    }
  };

  /**
   * Converts a Date object to a string in the format "YYYY-MM-DD".
   *
   * @param {Date} dateValue - The Date object to convert to a string.
   * @returns {string} The formatted date string in "YYYY-MM-DD" format.
   */
  #convertToString = dateValue => {
    const year = dateValue.getFullYear();
    const month = String(dateValue.getMonth() + 1).padStart(2, '0');
    const day = String(dateValue.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
}

export default DateState;
