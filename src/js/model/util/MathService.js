import { MAX_AMOUNT } from '../../util/Config.js';

class MathService {
  /**
   * Processes the input amount by parsing and verifying it.
   *
   * @param {string} value - The input value to be processed.
   * @returns {number} The processed amount.
   */
  processInputAmount = value => {
    const parsedAmount = this.#parseInputAmount(value);
    return this.#verifyInputAmount(parsedAmount);
  };

  /**
   * Parses the input value by removing all non-digit characters and converting it to an integer.
   *
   * @param {string} value - The input value to be parsed.
   * @returns {number} The parsed amount as an integer. Returns 0 if the input is invalid or empty.
   * @private
   */
  #parseInputAmount = value => {
    const cleanedValue = value.replace(/\D/g, '');
    return cleanedValue ? parseInt(cleanedValue) : 0;
  };

  /**
   * Verifies the parsed amount. If the amount exceeds the maximum allowed amount,
   * it reduces the amount by a factor of 10.
   *
   * @param {number} amount - The parsed amount to be verified.
   * @returns {number} The verified amount, adjusted if it exceeds the maximum allowed.
   * @private
   */
  #verifyInputAmount = amount => {
    return amount > MAX_AMOUNT ? Math.floor(amount / 10) : amount;
  };
}

export default new MathService();
