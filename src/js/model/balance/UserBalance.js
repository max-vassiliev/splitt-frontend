import TypeParser from '../util/TypeParser.js';

class UserBalance {
  #userId;
  #balance;
  #details;

  constructor(userId, balance, details = []) {
    this.userId = userId;
    this.balance = balance;
    this.details = details;
  }

  /**
   * Sets the user ID.
   * @param {number | BigInt} value — Must be a positive number or BigInt value.
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
   * Sets the balance for the user.
   * @param {number} value — Must be an integer.
   * @throws {Error} If the value is not an integer.
   */
  set balance(value) {
    if (!Number.isInteger(value)) {
      throw new Error(
        `Invalid balance: expected an integer. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#balance = value;
  }

  /**
   * Gets the balance for the user.
   * @returns {number} The balance for the user.
   */
  get balance() {
    return this.#balance;
  }

  /**
   * Sets the details for the user balance.
   * @param {Array} value — Must be an array of UserBalanceDetail objects or an empty array.
   * @throws {Error} If the value is not an array.
   */
  set details(value) {
    if (!Array.isArray(value)) {
      throw new Error(
        `Invalid user balance details data: expected an Array. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#details = value;
  }

  /**
   * Gets the details for the user balance.
   * @returns {Array} The details for the user balance: an array of UserBalanceDetail objects or an empty array.
   */
  get details() {
    return this.#details;
  }
}

export default UserBalance;
