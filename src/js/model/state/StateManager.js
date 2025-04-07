import state from './State.js';
import groupManager from '../group/GroupManager.js';
import balanceManager from '../balance/UserBalanceManager.js';
import userManager from '../user/UserManager.js';
import TransactionManager from '../transaction/TransactionManager.js';
import User from '../user/User.js';
import Group from '../group/Group.js';
import GroupOption from '../group/GroupOption.js';
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

  // UPDATE DEMO

  /**
   * Updates the application state after a mock transaction is added,
   * used specifically in the Demo version of the app.
   *
   * @param {Object} data - The mock update data returned from the demo API.
   * @param {Object} data.balances - Updated balances after the demo transaction.
   * @param {Array<Object>} data.transactions - Updated list of transactions.
   *
   * @returns {void}
   */
  updateAfterAddTransactionDemo = data => {
    balanceManager.update(state.balances, data.balances);
    state.transactions = TransactionManager.initializeTransactionsOnLoad({
      transactionsData: data.transactions,
      users: state.members,
      currentUserId: state.userId,
    });
    state.userStatus = this.#determineUserStatus();
  };

  /**
   * LOAD
   */

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
    state.balances = balanceManager.initializeUserBalancesOnLoad(
      data.balances,
      data.members
    );
    state.transactions = TransactionManager.initializeTransactionsOnLoad({
      transactionsData: data.transactions,
      users: state.members,
      currentUserId: state.userId,
    });
    state.userStatus = this.#determineUserStatus();
  }

  /**
   * Loads the group options from the provided JSON data.
   * @param {Array<Object>} data An array of objects parsed from JSON.
   */
  loadGroupOptions(data) {
    const currentGroupId = state.group.id;
    const groupOptions = groupManager.initializeGroupOptions(
      data,
      currentGroupId
    );
    state.groupOptions = groupOptions;
    state.isGroupOptionsLoaded = true;
  }

  /**
   * SET
   */

  /**
   * Sets the currently active modal ID.
   * @param {number|null} modalId — The modal ID to set as active.
   */
  setActiveModalId(modalId) {
    state.activeModalId = modalId;
  }

  /**
   * GET
   */

  /**
   * Gets the entire state.
   * NOTE: This is a utility method for development purposes. Try to avoid using it.
   * @returns {Object} The entire state object.
   */
  getState() {
    return state;
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
   * Gets the current user's ID.
   * @returns {BigInt} userId — The current user's ID.
   */
  getUserId() {
    return state.userId;
  }

  /**
   * Gets the IDs of current user and group.
   * @returns {{userId: BigInt, groupId: BigInt}} An object containing userId and groupId.
   */
  getUserIdAndGroupId() {
    const userId = state.userId;
    const groupId = state.group.id;
    return { userId, groupId };
  }

  /**
   * Gets the current group.
   * @returns {Group} A Group instance with current group data.
   */
  getGroup() {
    return state.group;
  }

  /**
   * Checks if the user's group options have been loaded.
   * @returns {boolean} — True if the group options have been loaded, otherwise false.
   */
  isGroupOptionsLoaded() {
    return state.isGroupOptionsLoaded;
  }

  /**
   * Gets the current user's group options.
   * @returns {Array<GroupOption>|null} The sorted group options array or null if empty.
   */
  getGroupOptions() {
    const groupOptionsMap = state.groupOptions;
    if (groupOptionsMap.size === 0) return null;

    const groupOptions = Array.from(groupOptionsMap.values()).sort(
      (a, b) => a.order - b.order
    );

    return groupOptions;
  }

  /**
   * Gets the group members map.
   * @returns {Map<BigInt, User>} The members map with userId (BigInt) as key and User as value.
   */
  getMembers() {
    return state.members;
  }

  /**
   * Gets the number of members in the group.
   * @returns {number} The number of group members.
   */
  getMembersCount() {
    return state.members.size;
  }

  /**
   * Gets the user by ID.
   * @param {bigint} id The user's ID.
   * @returns {User} The User object with data on the group member.
   */
  getMemberById = id => {
    return state.members.get(id);
  };

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
   * Gets the active modal ID.
   * @returns {number|null} An the active modal ID or null.
   */
  getActiveModalId() {
    return state.activeModalId;
  }

  /**
   * Gets required pagination data.
   * @returns {Object} A page data object containing the fields:
   *                     - page (number): the current page number
   *                     - transactionsCount (number): the number of transactions on the current page
   *                     - transactionsPerPage (number): the maximum number of transactions per page
   */
  getPageData() {
    return {
      page: state.page,
      transactionsCount: state.transactions.length,
      transactionsPerPage: state.transactionsPerPage,
    };
  }

  /**
   * Auxiliary Methods and Validation
   */

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
