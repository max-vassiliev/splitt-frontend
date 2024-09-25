import {
  isIntegerOrNull,
  isPositiveNumber,
  isNonEmptyStringOrNull,
} from '../../util/SplittValidator.js';
import { AppUtils } from '../../util/AppUtils.js';
import RepaymentParty from './RepaymentParty.js';

class Repayment {
  #id;
  #amount;
  #currentUserBalance;
  #date;
  #emoji;
  #payer;
  #recipient;

  /**
   * Sets the repayment ID as a BigInt.
   * @param {number|BigInt} value — Must be a positive number or BigInt.
   */
  set id(value) {
    this.#id = AppUtils.parseId(value);
  }

  /**
   * Gets the repayment ID.
   * @returns {BigInt} The repayment ID.
   */
  get id() {
    return this.#id;
  }

  /**
   * Sets the amount for the repayment.
   * @param {number} value — Must be a whole positive number.
   * @throws {Error} - Throws an error if the value is not a positive number.
   */
  set amount(value) {
    if (!isPositiveNumber(value)) {
      throw new Error(
        `Invalid amount: expected a whole positive number. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#amount = value;
  }

  /**
   * Gets the amount for the repayment.
   * @returns {number} The amount for the repayment.
   */
  get amount() {
    return this.#amount;
  }

  /**
   * Sets the current user's balance for the repayment.
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

  /**
   * Gets the current user's balance for the repayment.
   * @returns {number|null} The current user's balance.
   */
  get currentUserBalance() {
    return this.#currentUserBalance;
  }

  /**
   * Sets the date for the repayment.
   * @param {Date} value — Must be a Date object.
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
   * Gets the date for the repayment.
   * @returns {Date} - Returns a Date object with the repayment date.
   */
  get date() {
    return this.#date;
  }

  /**
   * Sets the emoji for the repayment.
   * @param {string} value — Must be a non-empty string or null.
   * @throws {Error} - Throws an error if the value is not a non empty string or null
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
   * Gets the emoji for the repayment.
   * @returns {string|null} - Returns a string with the emoji or null.
   */
  get emoji() {
    return this.#emoji;
  }

  /**
   * Sets the payer of the repayment.
   * @param {RepaymentParty} value
   */
  set payer(value) {
    if (!(value instanceof RepaymentParty)) {
      throw new Error(
        `Invalid value for payer: expected an instance of RepaymentParty. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#payer = value;
  }

  /**
   * Gets the payer of the repayment.
   * @returns {RepaymentParty}
   */
  get payer() {
    return this.#payer;
  }

  /**
   * Sets the recipient of the repayment.
   * @param {RepaymentParty} value
   */
  set recipient(value) {
    if (!(value instanceof RepaymentParty)) {
      throw new Error(
        `Invalid value for recipient: expected an instance of RepaymentParty. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#recipient = value;
  }

  /**
   * Gets the recipient of the repayment.
   * @returns {RepaymentParty}
   */
  get recipient() {
    return this.#recipient;
  }
}

export default Repayment;
