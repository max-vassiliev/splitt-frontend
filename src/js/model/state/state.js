import { AppUtils } from '../../util/AppUtils.js';
import { isPositiveInteger } from '../../util/SplittValidator.js';
import { STATUS_NEUTRAL, STATUS_OPTIONS } from '../../util/Config.js';
import UserBalance from '../balance/UserBalance.js';
import Group from '../group/Group.js';
import GroupOption from '../group/GroupOption.js';
import Expense from '../transaction/Expense.js';
import Repayment from '../transaction/Repayment.js';

class State {
  #userId = null;
  #userStatus = STATUS_NEUTRAL;
  #group = {};
  #groupOptions = new Map();
  #isGroupOptionsLoaded = false;
  #members = new Map();
  #balances = new Map();
  #transactions = [];
  #activeModal = null;
  #page = 1;
  #transactionsPerPage = 10;
  #locale = 'ru-RU';
  #currencySymbol = '₽';

  /**
   * Gets the current user ID.
   * @returns {BigInt} - Returns the current user's ID as a BigInt value.
   */
  get userId() {
    return this.#userId;
  }

  /**
   * Sets the current user's ID as a BigInt value.
   * @param {number|BigInt} value — Must be a positive number or a BigInt value.
   */
  set userId(value) {
    this.#userId = AppUtils.parseId(value);
  }

  /**
   * Gets the user's balance status.
   * @returns {string} One of the predefined string values.
   * @see STATUS_OPTIONS The available status options.
   */
  get userStatus() {
    return this.#userStatus;
  }

  /**
   * Sets the user's balance status.
   * @param {string} value - Accepts one of the predefined string values.
   * @see STATUS_OPTIONS The available status options.
   * @throws {Error} If the value is not a valid status option.
   */
  set userStatus(value) {
    if (!value || !STATUS_OPTIONS.has(value)) {
      throw new Error(
        `Invalid value for "userStatus": "${value}" (${typeof value}). Expected one of: ${Array.from(
          STATUS_OPTIONS
        ).join(', ')}.`
      );
    }
    this.#userStatus = value;
  }

  /**
   * Gets the current group.
   * @returns {Group} — An instance of Group with current group data.
   */
  get group() {
    return this.#group;
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
   * Gets the 'isGroupOptionsLoaded' field.
   * @returns {boolean} — True if the group options have been loaded, otherwise false.
   */
  get isGroupOptionsLoaded() {
    return this.#isGroupOptionsLoaded;
  }

  /**1
   * Sets the 'isGroupOptionsLoaded' field.
   * Should be set to 'true' after loading the group options from the API.
   * @param {boolean} value — The new value for 'isGroupOptionsLoaded'.
   * @throws {Error} — If the value is not a boolean.
   */
  set isGroupOptionsLoaded(value) {
    if (typeof value !== 'boolean') {
      throw new Error(
        `Invalid value for 'isGroupOptionsLoaded'. Expected a boolean. Received: ${value} (${typeof value})`
      );
    }
    this.#isGroupOptionsLoaded = value;
  }

  /**
   * Gets the user's group options.
   * @returns {Map<bigint, GroupOption>} — The "groupOptions" map.
   */
  get groupOptions() {
    return this.#groupOptions;
  }

  /**
   * Sets the user's group options.
   * @param {Map<bigint, GroupOption>} value — The map with group options.
   */
  set groupOptions(value) {
    this.#validateGroupOptions(value);
    this.#groupOptions = value;
  }

  /**
   * Validates the user's group options before saving.
   * @param {Map|Map<bigint, GroupOption>} groupOptions — The map to validate. Can be an empty map.
   * @throws {Error} — Throws error in the following conditions:
   *                   1) The input is not a Map.
   *                   2) Any key is not a BigInt.
   *                   3) Any value is not an instance of GroupOption.
   */
  #validateGroupOptions(groupOptions) {
    if (!(groupOptions instanceof Map)) {
      throw new Error(
        `Invalid "groupOptions" data. Expected a Map. Received: ${groupOptions} (${typeof groupOptions}).`
      );
    }

    groupOptions.forEach((groupOption, id) => {
      if (typeof id !== 'bigint') {
        throw new Error(
          `Invalid group option ID. Expected a BigInt. Received: ${id} (${typeof id}).`
        );
      }
      if (!(groupOption instanceof GroupOption)) {
        throw new Error(
          `Invalid group option. Expected an instance of GroupOption. Received: ${groupOption} (${typeof groupOption}).`
        );
      }
    });
  }

  /**
   * Gets the "members" map.
   * @returns {Map<BigInt, User>} - The members map with userId (BigInt) as key and User as value.
   */
  get members() {
    return this.#members;
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
   * Gets the "balances" map.
   * @returns {Map<BigInt, UserBalance>} - The balances map with userId (BigInt) as key and UserBalance as value.
   */
  get balances() {
    return this.#balances;
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
   * Gets the "transactions" array.
   * @returns {Array} - An array with Expense or Repayment instances or an empty array.
   */
  get transactions() {
    return this.#transactions;
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
   * Gets the active modal.
   * @returns {HTMLElement|null} An HTMLElement of the active modal or null.
   */
  get activeModal() {
    return this.#activeModal;
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
   * Gets the current page.
   * @returns {number} The page number.
   */
  get page() {
    return this.#page;
  }

  /**
   * Sets the current page.
   * @param {number} value A positive integer.
   * @throws {Error} Throws an error if the value is not a positive integer.
   */
  set page(value) {
    if (!isPositiveInteger(value)) {
      throw new Error(
        `Invalid page value. Expected a positive integer. Received: ${value} (${typeof value})`
      );
    }
    this.#page = value;
  }

  /**
   * Gets the limit for transactions per page.
   * @returns {number} The number of transactions per page.
   */
  get transactionsPerPage() {
    return this.#transactionsPerPage;
  }

  /**
   * Sets the number of transactions per page.
   * @param {number} value A positive integer.
   * @throws {Error} Throws an error if the value is not a positive integer.
   */
  set transactionsPerPage(value) {
    if (!isPositiveInteger(value)) {
      throw new Error(
        `Invalid transactionsPerPage value. Expected a positive integer. Received: ${value} (${typeof value})`
      );
    }
    this.#transactionsPerPage = value;
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
