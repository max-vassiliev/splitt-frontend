import state from './State.js';
import groupManager from '../group/GroupManager.js';
import balanceManager from '../balance/UserBalanceManager.js';
import userManager from '../user/UserManager.js';
import TransactionManager from '../transaction/TransactionManager.js';
import User from '../user/User.js';
import Group from '../group/Group.js';
import UserBalance from '../balance/UserBalance.js';
import {
  STATUS_NEUTRAL,
  STATUS_NEGATIVE,
  STATUS_POSITIVE,
} from '../../util/Config.js';

class StateManager {
  #requiredFieldsOnPageLoad = [
    'balances',
    'transactions',
    'currentUserId',
    'group',
  ];

  /**
   * Loads the initial application state from the provided data object.
   *
   * This method validates the provided data and then initializes various parts
   * of the application state, including the current user, group information,
   * members, balances and transactions.
   *
   * @param {Object} data The data object containing the initial state information.
   * @param {BigInt|string|number} data.currentUserId The ID of the current user, which can be a BigInt, string, or number.
   * @param {Object} data.group The group data to initialize.
   * @param {Array} data.members The array of member data to initialize.
   * @param {Array} data.balances The array of balance data to initialize.
   * @param {Array} data.transactions The array of transaction data to initialize.
   */
  loadState(data) {
    this.#validateDataOnPageLoad(data);

    state.userId = data.currentUserId;
    state.group = groupManager.initializeGroupOnLoad(data.group);
    state.members = userManager.initializeMembersOnLoad(data.members);
    state.balances = balanceManager.initializeUserBalancesOnLoad(data.balances);
    state.transactions = TransactionManager.initializeTransactionsOnLoad({
      transactionsData: data.transactions,
      users: state.members,
      currentUserId: state.userId,
    });
    state.userStatus = this.#determineUserStatus();
  }

  /**
   * Gets the entire state.
   * NOTE: Try to avoid using this method.
   * @returns {Object} The entire state object.
   */
  getState() {
    return state;
  }

  /**
   * Gets the current group.
   * @returns {Group} A Group instance with current group data.
   */
  getGroup() {
    return state.group;
  }

  /**
   * Gets the current user.
   * @returns {User} A User instance with current user data.
   */
  getCurrentUser() {
    const userId = state.userId;
    const currentUser = state.members.get(userId);

    return currentUser;
  }

  /**
   * Gets the group members map.
   * @returns {Map<BigInt, User>} The members map with userId (BigInt) as key and User as value.
   */
  getMembers() {
    return state.members;
  }

  /**
   * Retrieves a map of members filtered by the given array of IDs.
   * @param {Array} ids - An array of member IDs to filter from the state.members map.
   * @returns {Map} A new map containing only the members whose IDs are present in the given array.
   * @throws {TypeError} If the ids parameter is not a non-empty array.
   */
  getMembersByIds(ids) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new TypeError(
        `Invalid data for "ids". Expected a non-empty array. Received: ${ids} (${typeof ids})`
      );
    }

    const filteredMembers = new Map();
    const members = state.members;
    ids.forEach(id => {
      if (members.has(id)) {
        filteredMembers.set(id, members.get(id));
      }
    });

    return filteredMembers;
  }

  /**
   * Gets the current user's status
   * @returns {string} The user's status.
   */
  getUserStatus() {
    return state.userStatus;
  }

  /**
   * Gets the current user's full balance with details.
   * @returns {UserBalance} - An instance of UserBalance containing the user's ID, balance, and details.
   *                          The details property is either an empty array or an array of UserBalanceDetails instances.
   */
  getCurrentUserBalance() {
    const currentUserId = state.userId;
    const currentUserBalance = state.balances.get(currentUserId);

    return currentUserBalance;
  }

  /**
   * Gets the group balances map.
   * @returns {Map<BigInt, UserBalance>} The group balances map with userId (BigInt) as key and UserBalance as value.
   */
  getGroupBalances() {
    return state.balances;
  }

  /**
   * Gets the locale and currency symbol.
   * @returns {Object} The object with locale (string) and currency symbol (string).
   */
  getLocaleAndCurrencySymbol() {
    return {
      locale: state.locale,
      currencySymbol: state.currencySymbol,
    };
  }

  /**
   * Gets the transactions.
   * @returns {Array} The transactions array.
   */
  getTransactions() {
    return state.transactions;
  }

  /**
   * Sets the currently active modal.
   * @param {HTMLElement|null} value - The modal element to set as active, or `null` if no modal is active.
   */
  setActiveModal(value) {
    state.activeModal = value;
  }

  /**
   * Gets the currently active modal.
   * @returns {HTMLElement|null} The active modal element, or `null` if no modal is active.
   */
  getActiveModal() {
    return state.activeModal;
  }

  /**
   * Determines the current user status based on their balance.
   * @returns {string} The user's status.
   */
  #determineUserStatus() {
    const userId = state.userId;
    const { balance } = state.balances.get(userId);

    if (!balance) {
      return STATUS_NEUTRAL;
    }
    return balance < 0 ? STATUS_NEGATIVE : STATUS_POSITIVE;
  }

  /**
   * Validates the data object provided during page load.
   *
   * This method ensures that the data object is an object and contains all
   * required fields specified in #requiredFieldsOnPageLoad. If the data object
   * is invalid or any required field is missing, an error is thrown.
   *
   * @param {Object} data - The data object to validate. This object should contain
   *                        all necessary fields for initializing the application state.
   * @throws {Error} If the data object is invalid or any required field is missing.
   * @see #requiredFieldsOnPageLoad For the list of required fields that must be present in the data object.
   */
  #validateDataOnPageLoad(data) {
    if (!data || typeof data !== 'object')
      throw new Error(`Invalid data object. Received: ${data} (type: ${data})`);
    this.#requiredFieldsOnPageLoad.forEach(field => {
      if (!(field in data)) {
        throw new Error(`Missing required field "${field}" for page load.`);
      }
    });
  }
}

export default new StateManager();
