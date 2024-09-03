export class AppUtils {
  /**
   * Parses a date string and returns a Date object
   *
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
}
