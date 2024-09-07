import Group from '../group/Group';
import Expense from '../transaction/Expense.js';
import Repayment from '../transaction/Repayment.js';
import { isPositiveNumber } from '../../util/SplittValidator.js';

class State {
  #currentUserId = null;
  #group = {};
  #members = new Map();
  #balances = new Map();
  #transactions = [];
  #activeModal = null;
  #locale = 'ru-RU';
  #currencySymbol = '₽';

  /**
   * @param {number} value — Must be a positive number.
   */
  set currentUserId(value) {
    if (!isPositiveNumber(value)) {
      throw new Error(
        `Invalid ID: expected a positive number. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#currentUserId = value;
  }

  get currentUserId() {
    return this.#currentUserId;
  }

  /**
   * @param {Group} value — Must be an instance of Group.
   */
  set group(value) {
    if (!value || !(value instanceof Group)) {
      throw Error(
        `Invalid group. The value must be a non-null instance of Group. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#group = value;
  }

  get group() {
    return this.#group;
  }

  /**
   * @param {Map} value — Must be an instance of Map.
   */
  set members(value) {
    if (!value || !(value instanceof Map)) {
      throw new Error(
        `Invalid members data: expected a Map. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#members = value;
  }

  get members() {
    return this.#members;
  }

  /**
   * @param {Map} value — Must be an instance of Map.
   */
  set balances(value) {
    if (!value || !(value instanceof Map)) {
      throw new Error(
        `Invalid balances data: expected a Map. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#balances = value;
  }

  get balances() {
    return this.#balances;
  }

  /**
   * @param {Array} value — Must be an instance of Array.
   */
  set transactions(value) {
    this.#validateTransactions(value);
    this.#transactions = value;
  }

  get transactions() {
    return this.#transactions;
  }

  /**
   * Validates the transactions array.
   *
   * @param {Array} transactions — Must be an array of Repayment or Expense instances or an emtpy array.
   * @throws {Error} If the transactions array is not valid.
   */
  #validateTransactions(transactions) {
    if (!Array.isArray(transactions)) {
      throw new Error(
        `Invalid transactions data: expected an Array. Received: ${transactions} (type: ${typeof transactions})`
      );
    }

    if (transactions.length === 0) return;

    for (const transaction of transactions) {
      if (
        !(transaction instanceof Expense) &&
        !(transaction instanceof Repayment)
      ) {
        throw new Error(
          `Invalid transaction item: expected instances of Expense or Repayment. Received: ${transaction} (type: ${typeof transaction})`
        );
      }
    }
  }

  /**
   * @param {HTMLElement | null} value — The modal element to set as active. Must not be an HTMLElement or null.
   * @throws {Error} Throws an error if the provided value is neither HTMLElement nor null.
   */
  set activeModal(value) {
    if (value !== null && !(value instanceof HTMLElement)) {
      throw new Error(
        `Invalid active modal element: must an HTMLElement or null. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#activeModal = value;
  }

  get activeModal() {
    return this.#activeModal;
  }

  get locale() {
    return this.#locale;
  }

  get currencySymbol() {
    return this.#currencySymbol;
  }
}

export default new State();
