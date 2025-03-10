import {
  isIntegerOrNull,
  isPositiveInteger,
  isNonEmptyStringOrNull,
  isNonEmptyString,
} from '../../../util/SplittValidator.js';
import TypeParser from '../../../util/TypeParser.js';

class Expense {
  #id;
  #amount;
  #currentUserBalance;
  #date;
  #emoji;
  #title;

  /**
   * Sets the expense ID as a BigInt.
   * @param {number|BigInt} value — Must be a positive number or BigInt.
   */
  set id(value) {
    this.#id = TypeParser.parseId(value);
  }

  /**
   * Gets the expense ID.
   * @returns {BigInt} - Returns the expense ID as a BigInt.
   */
  get id() {
    return this.#id;
  }

  /**
   * Sets the title of the expense.
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

  /**
   * Gets the title of the expense.
   * @returns {string} The title of the expense.
   */
  get title() {
    return this.#title;
  }

  /**
   * Sets the expense amount.
   * @param {number} value Must be a positive integer.
   * @throws {Error} If the value is not a positive integer.
   */
  set amount(value) {
    if (!isPositiveInteger(value)) {
      throw new Error(
        `Invalid amount: expected a whole positive number. Received: ${value} (type: ${typeof value}).`
      );
    }
    this.#amount = value;
  }

  /**
   * Gets the amount for the expense.
   * @returns {number} The amount for the expense.
   */
  get amount() {
    return this.#amount;
  }

  /**
   * Sets the current user's balance for the expense.
   * @param {number|null} value — Must be a whole number or null.
   * @throws {Error} If the value is not a whole number or null.
   */
  set currentUserBalance(value) {
    if (!isIntegerOrNull(value)) {
      throw new Error(
        `Invalid user balance: expected a whole number or null. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#currentUserBalance = value;
  }

  /**
   * Gets the current user's balance.
   * @returns {number|null} The current user's balance.
   */
  get currentUserBalance() {
    return this.#currentUserBalance;
  }

  /**
   * Sets the date for the expense.
   * @param {Date} value — Must be a Date object.
   * @throws {Error} If the value is not a Date object.
   */
  set date(value) {
    if (!(value instanceof Date)) {
      throw new Error(
        `Invalid date: expected a Date value. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#date = value;
  }

  /**
   * Gets the date for the expense.
   * @returns {Date} The date for the expense.
   */
  get date() {
    return this.#date;
  }

  /**
   * Sets the emoji for the expense.
   * @param {string|null} value — Must be a non-empty string or null.
   * @throws {Error} If the value is not a non-empty string or null.
   */
  set emoji(value) {
    if (!isNonEmptyStringOrNull(value)) {
      throw new Error(
        `Invalid value for emoji: expected a non-empty string or null. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#emoji = value;
  }

  /**
   * Gets the emoji for the expense.
   * @returns {string|null} The emoji for the expense.
   */
  get emoji() {
    return this.#emoji;
  }
}

export default Expense;
