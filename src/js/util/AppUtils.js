import { isPositiveNumber } from './SplittValidator.js';

export class AppUtils {
  /**
   * Parses an ID value and returns a BigInt.
   * @param {number|BigInt} value — Must be a positive number or BigInt value.
   * @throws {Error} If the input value is not a postive number or a BigInt value.
   */
  static parseId(value) {
    if (!isPositiveNumber(value)) {
      throw new Error(
        `Invalid ID: expected a positive number or BigInt. Received: ${value} (type: ${typeof value})`
      );
    }
    return BigInt(value);
  }

  /**
   * Parses a date string and returns a Date object
   * @param {string} inputDate - The date string to parse. It should be in a format recognized by the JavaScript Date constructor.
   * @returns {Date} parsedDate
   * @throws {Error} If the inputDate is not a valid date string, an error is thrown.
   */
  static parseDate(inputDate) {
    const parsedDate = new Date(inputDate);

    if (
      !inputDate ||
      typeof inputDate === 'number' ||
      isNaN(parsedDate.getTime())
    ) {
      throw new Error(
        `Invalid date string: ${inputDate} (type: ${typeof inputDate})`
      );
    }

    return parsedDate;
  }

  /**
   * Converts a Date object to a string in 'YYYY-MM-DD' format.
   * This format is used for communicating with the backend.
   *
   * @param {Date} date - The Date object to format.
   * @returns {string} The formatted date string in 'YYYY-MM-DD' format.
   */
  static formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Converts a Date object to a string in 'DD.MM.YYYY' format.
   * This format is used for displaying dates to the user.
   *
   * @param {Date} date - The Date object to format.
   * @returns {string} The formatted date string in 'DD.MM.YYYY' format.
   */
  static formatDateForDisplay(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}.${month}.${year}`;
  }
}
