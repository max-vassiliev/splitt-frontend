import TypeParser from '../../util/TypeParser.js';

class UserBalanceDetail {
  #userId;
  #amount;

  constructor(userId, amount) {
    this.userId = userId;
    this.amount = amount;
  }

  /**
   * Sets the user ID.
   * @param {number | BigInt} value — Must be a positive number or BigInt.
   */
  set userId(value) {
    this.#userId = TypeParser.parseId(value);
  }

  /**
   * Gets the user ID.
   * @returns {BigInt} The user ID.
   */
  get userId() {
    return this.#userId;
  }

  /**
   * Sets the amount for the user balance detail.
   * @param {number} value — Must be an integer.
   * @throws {Error} If the value is not an integer.
   */
  set amount(value) {
    if (!Number.isInteger(value)) {
      throw new Error(
        `Invalid amount: expected an integer. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#amount = value;
  }

  /**
   * Gets the amount for the user balance detail.
   * @returns {number} The amount for the user balance detail.
   */
  get amount() {
    return this.#amount;
  }
}

export default UserBalanceDetail;
