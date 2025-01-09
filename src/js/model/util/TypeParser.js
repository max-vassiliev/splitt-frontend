import {
  isPositiveNumber,
  isNumericString,
} from '../../util/SplittValidator.js';

class TypeParser {
  /**
   * Parses an ID value and returns a BigInt.
   * @param {number|BigInt} value — Must be a positive number or BigInt value.
   * @throws {Error} If the input value is not a postive number or a BigInt value.
   */
  parseId(value) {
    if (!isPositiveNumber(value)) {
      throw new Error(
        `Invalid ID: expected a positive number or BigInt. Received: ${value} (type: ${typeof value})`
      );
    }
    return BigInt(value);
  }

  /**
   * Parses a string and returns a BigInt.
   * @param {string} value — Must be a string that represents a positive integer.
   * @throws {Error} If the input value is not a string or does not represent a positive integer.
   */
  parseStringToBigInt(value) {
    if (!isNumericString(value)) {
      throw new Error(
        `Invalid ID: expected a string representing a positive integer. Received: ${value} (type: ${typeof value}).`
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
  parseDate(inputDate) {
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
}

export default new TypeParser();
