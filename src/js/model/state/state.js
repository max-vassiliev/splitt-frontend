import Group from '../group/Group';
import Expense from '../transaction/Expense.js';
import Repayment from '../transaction/Repayment.js';
import { AppUtils } from '../../util/AppUtils.js';
import UserBalance from '../balance/UserBalance.js';

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
   * Sets the current user's ID as a BigInt value.
   * @param {number|BigInt} value — Must be a positive number or a BigInt value.
   */
  set currentUserId(value) {
    this.#currentUserId = AppUtils.parseId(value);
  }

  /**
   * Gets the current user ID.
   * @returns {BigInt} - Returns the current user's ID as a BigInt value.
   */
  get currentUserId() {
    return this.#currentUserId;
  }

  /**
   * Sets the current group.
   * @param {Group} value — Must be an instance of Group.
   * @throws {Error} - Throws an error if the provided value is not an instance of Group.
   */
  set group(value) {
    if (!value || !(value instanceof Group)) {
      throw Error(
        `Invalid group. The value must be a non-null instance of Group. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#group = value;
  }

  /**
   * Gets the current group.
   * @returns {Group} — An instance of Group with current group data.
   */
  get group() {
    return this.#group;
  }

  /**
   * Sets the "members" map.
   * @param {Map<BigInt, User>} value — Must be an instance of Map with userId as key and a User instance as value.
   * @throws {Error} If the provided value is not a Map.
   */
  set members(value) {
    if (!value || !(value instanceof Map)) {
      throw new Error(
        `Invalid members data: expected a Map. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#members = value;
  }

  /**
   * Gets the "members" map.
   * @returns {Map<BigInt, User>} - The members map with userId (BigInt) as key and User as value.
   */
  get members() {
    return this.#members;
  }

  /**
   * Sets the "balances" map.
   * @param {Map<BigInt, UserBalance>} value Must be an instance of Map with userId as key and UserBalance as value.
   * @throws {Error} If the provided value is not a Map.
   */
  set balances(value) {
    if (!value || !(value instanceof Map)) {
      throw new Error(
        `Invalid balances data: expected a Map. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#balances = value;
  }

  /**
   * Gets the "balances" map.
   * @returns {Map<BigInt, UserBalance>} - The balances map with userId (BigInt) as key and UserBalance as value.
   */
  get balances() {
    return this.#balances;
  }

  /**
   * Sets the "transactions" array.
   * @param {Array} value — Must be an array with Expense or Repayment instances or an empty array.
   */
  set transactions(value) {
    this.#validateTransactions(value);
    this.#transactions = value;
  }

  /**
   * Gets the "transactions" array.
   * @returns {Array} - An array with Expense or Repayment instances or an empty array.
   */
  get transactions() {
    return this.#transactions;
  }

  /**
   * Validates the transactions array.
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
   * Sets the active modal.
   * @param {HTMLElement|null} value — The modal element to set as active. Must not be an HTMLElement or null.
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

  /**
   * Gets the active modal.
   * @returns {HTMLElement|null} - An HTMLElement of the active modal or null.
   */
  get activeModal() {
    return this.#activeModal;
  }

  /**
   * Gets the locale.
   * @returns {string} - A string with the current locale.
   */
  get locale() {
    return this.#locale;
  }

  /**
   * Gets the currency symbol.
   * @returns {string} - A string with the currency symbol.
   */
  get currencySymbol() {
    return this.#currencySymbol;
  }
}

export default new State();
