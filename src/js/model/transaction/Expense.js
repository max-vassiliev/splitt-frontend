import {
  isIntegerOrNull,
  isPositiveNumber,
  isNonEmptyStringOrNull,
  isNonEmptyString,
} from '../../util/SplittValidator.js';

class Expense {
  #id;
  #amount;
  #currentUserBalance;
  #date;
  #emoji;
  #title;

  /**
   * @param {number} value — Must be a positive number.
   */
  set id(value) {
    if (!isPositiveNumber(value)) {
      throw new Error(
        `Invalid ID: expected a positive number. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#id = value;
  }

  get id() {
    return this.#id;
  }

  /**
   * @param {string} value — Must be a non-empty string.
   */
  set title(value) {
    if (!isNonEmptyString(value)) {
      throw new Error(
        `Invalid value for title: expected a non-empty string. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#title = value;
  }

  get title() {
    return this.#title;
  }

  /**
   * @param {number} value — Must be a whole positive number.
   */
  set amount(value) {
    if (!isPositiveNumber(value)) {
      throw new Error(
        `Invalid amount: expected a whole positive number. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#amount = value;
  }

  get amount() {
    return this.#amount;
  }

  /**
   * @param {number} value — Must be a whole number or null.
   */
  set currentUserBalance(value) {
    if (!isIntegerOrNull(value)) {
      throw new Error(
        `Invalid user balance: expected a whole number or null. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#currentUserBalance = value;
  }

  get currentUserBalance() {
    return this.#currentUserBalance;
  }

  /**
   * @param {Date} value — Must be a date.
   */
  set date(value) {
    if (!(value instanceof Date)) {
      throw new Error(
        `Invalid date: expected a Date value. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#date = value;
  }

  get date() {
    return this.#date;
  }

  /**
   * @param {string} value — Must be a non-empty string or null.
   */
  set emoji(value) {
    if (!isNonEmptyStringOrNull(value)) {
      throw new Error(
        `Invalid value for emoji: expected a non-empty string or null. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#emoji = value;
  }

  get emoji() {
    return this.#emoji;
  }
}

export default Expense;
