import { isPositiveNumber } from '../../util/SplittValidator.js';

class UserBalance {
  #userId;
  #balance;
  #details;

  constructor(userId, balance, details = []) {
    this.#userId = userId;
    this.#balance = balance;
    this.#details = details;
  }

  /**
   * @param {number} value — Must be a positive number.
   */
  set userId(value) {
    if (!isPositiveNumber(value)) {
      throw new Error(
        `Invalid ID: expected a positive number. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#userId = value;
  }

  get userId() {
    return this.#userId;
  }

  /**
   * @param {number} value — Must be an integer.
   */
  set balance(value) {
    if (!Number.isInteger(value)) {
      throw new Error(
        `Invalid balance: expected an integer. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#balance = value;
  }

  get balance() {
    return this.#balance;
  }

  /**
   * @param {Array} transactions — Must be an array.
   */
  set details(value) {
    if (!Array.isArray(value)) {
      throw new Error(
        `Invalid user balance details data: expected an Array. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#details = value;
  }

  get details() {
    return this.#details;
  }
}

export default UserBalance;
