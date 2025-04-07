import {
  EXPENSE_SPLITT_EQUALLY,
  DEFAULT_AMOUNT,
} from '../../../../util/Config.js';
import SplittState from './SplittState.js';

class SplittEquallyState extends SplittState {
  #splittAmounts;
  #selectedUsers;

  constructor() {
    super(EXPENSE_SPLITT_EQUALLY);
    this.#splittAmounts = new Map();
    this.#selectedUsers = new Set();
  }

  // Initialization

  /**
   * Initializes the state with a default splitt amount for each selected user.
   * @param {bigint[]} userIds - An array of user IDs to include in the splitt.
   */
  init = userIds => {
    userIds.forEach(userId => {
      this.#splittAmounts.set(userId, DEFAULT_AMOUNT);
      this.#selectedUsers.add(userId);
    });
    this.#validateForSubmission();
    this._isInitialized = true;
  };

  // Reset

  /**
   * Resets the Splitt Equally Form state by selecting all users
   * and assigning the default amount to each.
   *
   * Also triggers validation for form submission.
   *
   * @returns {void}
   */
  reset = () => {
    for (const userId of this.#splittAmounts.keys()) {
      this.#selectedUsers.add(userId);
      this.#splittAmounts.set(userId, DEFAULT_AMOUNT);
    }
    this.#validateForSubmission();
  };

  // Update

  /**
   * Updates the splitt amounts based on user selection
   * and validates the subform after the update.
   *
   * @param {Object} params - The update parameters.
   * @param {number} params.expenseAmount - The total expense amount.
   * @param {bigint} params.userId - The ID of the user being updated.
   * @returns {Object} An object containing the updated splitt amounts and validation status.
   */
  update = ({ expenseAmount, userId }) => {
    if (userId) this.#updateUser(userId);
    this.#calculateSplitts(expenseAmount);
    this.#validateForSubmission();
    return this.#prepareUpdateResponse();
  };

  /**
   * Recalculates the splitt amounts based on the provided expense amount
   * and validates the form state after recalculation.
   *
   * @param {number} expenseAmount - The total expense amount used for recalculation.
   */
  recalculate = expenseAmount => {
    this.#calculateSplitts(expenseAmount);
    this.#validateForSubmission();
  };

  // Getters

  /**
   * Retrieves the current splitt amounts.
   * @returns {Map<bigint, number>} A map of user IDs to their respective splitt amounts.
   */
  getSplittAmounts = () => {
    return new Map(this.#splittAmounts);
  };

  /**
   * Retrieves the IDs of the selected users.
   * @returns {Set<bigint>} The set with the selected users' IDs.
   */
  get selectedUsers() {
    return this.#selectedUsers;
  }

  // Prepare Output

  /**
   * Prepares the response containing updated splitt amounts and validation status.
   * @returns {Object} The update response object.
   * @property {Map<bigint, number>} splittAmounts - Updated splitt amounts.
   * @property {boolean} isValid - Whether the subform is valid for submission.
   */
  #prepareUpdateResponse = () => {
    return {
      splittAmounts: this.getSplittAmounts(),
      selectedUsers: this.selectedUsers,
      isValid: this._isValid,
    };
  };

  // Inner Logic

  /**
   * Validates whether the current state is valid for submission.
   * A valid state requires at least one selected user.
   */
  #validateForSubmission = () => {
    this._isValid = this.#selectedUsers.size === 0 ? false : true;
  };

  /**
   * Updates the selected users set by adding or removing a user based on selection status.
   * If a user is deselected, their split amount is reset to the default amount.
   *
   * @param {bigint} userId - The ID of the user to update.
   */
  #updateUser = userId => {
    const shouldSelect = !this.#selectedUsers.has(userId);
    if (shouldSelect) {
      this.#selectedUsers.add(userId);
    } else {
      this.#selectedUsers.delete(userId);
      this.#splittAmounts.set(userId, DEFAULT_AMOUNT);
    }
  };

  /**
   * Calculates and updates the splitt amounts based on the number of selected users and the expense amount.
   * @param {number} expenseAmount The total expense amount to be split.
   */
  #calculateSplitts = expenseAmount => {
    switch (this.#selectedUsers.size) {
      case 0:
        this.#setDefaultSplitts();
        break;
      case 1:
        this.#calculateSplittsSingle(expenseAmount);
        break;
      default:
        this.#calculateSplittsDetailed(expenseAmount);
    }
  };

  /**
   * Sets the default amount to every splittAmounts entry
   */
  #setDefaultSplitts = () => {
    this.#splittAmounts.forEach((_, userId, splittsMap) => {
      splittsMap.set(userId, DEFAULT_AMOUNT);
    });
  };

  /**
   * Assigns the full expense amount to a single selected user.
   * @param {number} expenseAmount The expense amount.
   */
  #calculateSplittsSingle = expenseAmount => {
    const selectedUserId = this.#selectedUsers.values().next().value;
    this.#splittAmounts.set(selectedUserId, expenseAmount);
  };

  /**
   * Distributes the expense amount equally among selected users.
   * If the amount is not perfectly divisible, some users will receive a slightly higher amount.
   * @param {number} expenseAmount The expense amount.
   */
  #calculateSplittsDetailed = expenseAmount => {
    const selectedUsersCount = this.#selectedUsers.size;
    const baseAmount = Math.floor(expenseAmount / selectedUsersCount);
    const remainder = expenseAmount % selectedUsersCount;
    const usersWithHigherAmounts =
      this.#selectUsersWithHigherAmounts(remainder);
    this.#selectedUsers.forEach(userId => {
      let splittAmount = baseAmount;
      if (usersWithHigherAmounts.has(userId)) {
        splittAmount += 1;
      }
      this.#splittAmounts.set(userId, splittAmount);
    });
  };

  /**
   * Randomly selects users to receive a higher splitt amount when an expense is not evenly divisible.
   * @param {number} count The number of users to receive a higher amount.
   * @returns {Set<bigint>} A set of user IDs receiving a higher splitt amount.
   */
  #selectUsersWithHigherAmounts = count => {
    if (count === 0) return new Set();
    let allSelectedUsers = Array.from(this.#selectedUsers);
    allSelectedUsers.sort(() => Math.random() - 0.5);
    let usersWithHigherAmounts = allSelectedUsers.slice(0, count);
    return new Set(usersWithHigherAmounts);
  };
}

export default SplittEquallyState;
