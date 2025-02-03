import {
  EXPENSE_SPLITT_EQUALLY,
  DEFAULT_AMOUNT,
} from '../../../../util/Config.js';
import SplittState from './SplittState.js';

class SplittEquallyState extends SplittState {
  #splittAmounts;

  constructor() {
    super(EXPENSE_SPLITT_EQUALLY);
    this.#splittAmounts = new Map();
  }

  // Initialization

  /**
   * Initializes the state with a default splitt amount for each selected user.
   * @param {bigint[]} userIds - An array of user IDs to include in the splitt.
   */
  init = userIds => {
    userIds.forEach(userId => {
      this.#splittAmounts.set(userId, DEFAULT_AMOUNT);
    });
    this.#validateForSubmission();
    this._isInitialized = true;
    this.update();
  };

  // Update

  /**
   * Updates the splitt amounts based on user selection
   * and validates the subform after the update.
   *
   * @param {Object} params - The update parameters.
   * @param {number} params.expenseAmount - The total expense amount.
   * @param {bigint} params.userId - The ID of the user being updated.
   * @param {boolean} [params.isSelected=false] - Whether the user is selected in the splitt.
   * @returns {Object} An object containing the updated splitt amounts and validation status.
   */
  update = ({ expenseAmount, userId, isSelected = false }) => {
    if (userId) this.#updateSplittAmounts(userId, isSelected);
    this.#calculateSplitts(expenseAmount);
    this.#validateForSubmission();
    return this.#prepareUpdateResponse();
  };

  // Getters

  /**
   * Retrieves the current splitt amounts.
   * @returns {Map<bigint, number>} A map of user IDs to their respective splitt amounts.
   */
  getSplittAmounts = () => {
    return new Map(this.#splittAmounts);
  };

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
      isValid: this._isValid,
    };
  };

  // Inner Logic

  /**
   * Validates whether the current state is valid for submission.
   * A valid state requires at least one selected user.
   */
  #validateForSubmission = () => {
    this._isValid = this.#splittAmounts.size === 0 ? false : true;
  };

  /**
   * Adds or removes a user from the splitt amounts map based on selection status.
   * @param {bigint} userId - The user ID to update.
   * @param {boolean} isSelected - Whether the user is selected.
   */
  #updateSplittAmounts = (userId, isSelected) => {
    if (isSelected) {
      this.#splittAmounts.set(userId, DEFAULT_AMOUNT);
    } else {
      this.#splittAmounts.delete(userId);
    }
  };

  /**
   * Calculates and updates the splitt amounts based on the expense amount.
   * @param {number} expenseAmount The total expense amount to be split.
   */
  #calculateSplitts = expenseAmount => {
    const selectedUsers = this.#splittAmounts.size;
    if (selectedUsers === 0) return;
    if (selectedUsers === 1) {
      this.#calculateSplittsSingle(expenseAmount);
    } else {
      this.#calculateSplittsDetailed(expenseAmount);
    }
  };

  /**
   * Assigns the full expense amount to a single selected user.
   * @param {number} expenseAmount The expense amount.
   */
  #calculateSplittsSingle = expenseAmount => {
    const [userId] = this.#splittAmounts.entries().next().value;
    this.#splittAmounts.set(userId, expenseAmount);
  };

  /**
   * Distributes the expense amount equally among selected users.
   * If the amount is not perfectly divisible, some users will receive a slightly higher amount.
   * @param {number} expenseAmount The expense amount.
   */
  #calculateSplittsDetailed = expenseAmount => {
    const baseAmount = Math.floor(expenseAmount / selectedUsers);
    const remainder = expenseAmount % selectedUsers;
    const usersWithHigherAmounts = this.#selectUsersWithHigherAmounts(
      this.#splittAmounts.keys(),
      remainder
    );
    this.#splittAmounts.forEach((_, userId) => {
      let splittAmount = baseAmount;
      if (usersWithHigherAmounts.has(userId)) {
        splittAmount += 1;
      }
      this.#splittAmounts.set(userId, splittAmount);
    });
  };

  /**
   * Randomly selects users to receive a higher splitt amount when an expense is not evenly divisible.
   * @param {IterableIterator<bigint>} selectedUsers The set of selected user IDs.
   * @param {number} count The number of users to receive a higher amount.
   * @returns {Set<bigint>} A set of user IDs receiving a higher splitt amount.
   */
  #selectUsersWithHigherAmounts = (selectedUsers, count) => {
    if (count === 0) return new Set();
    let allSelectedUsers = Array.from(selectedUsers);
    allSelectedUsers.sort(() => Math.random() - 0.5);
    let usersWithHigherAmounts = allSelectedUsers.slice(0, count);
    return new Set(usersWithHigherAmounts);
  };
}

export default SplittEquallyState;
