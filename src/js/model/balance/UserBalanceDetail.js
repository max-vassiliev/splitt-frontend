import { isPositiveNumber } from '../../util/SplittValidator.js';

class UserBalanceDetail {
  #userId;
  #amount;

  constructor(userId, amount) {
    this.#userId = userId;
    this.#amount = amount;
  }

  /**
   * @param {number} value — Must be a positive number.
   */
  set userId(value) {
    if (!isPositiveNumber(value)) {
      throw new Error(
        `Invalid user ID: expected a positive number. Received: ${value} (type: ${typeof value})`
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
  set amount(value) {
    if (!Number.isInteger(value)) {
      throw new Error(
        `Invalid amount: expected an integer. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#amount = value;
  }

  get amount() {
    return this.#amount;
  }
}

export default UserBalanceDetail;
