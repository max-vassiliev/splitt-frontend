import {
  EXPENSE_SPLITT_PARTS,
  DEFAULT_AMOUNT,
} from '../../../../util/Config.js';
import SplittState from './SplittState.js';

class SplittPartsState extends SplittState {
  #splittAmounts;
  #total;
  #remainder;

  constructor() {
    super(EXPENSE_SPLITT_PARTS);
    this.#splittAmounts = new Map();
    this.#total = 0;
    this.#remainder = 0;
  }

  // Initialization

  init = userIds => {
    userIds.forEach(userId => {
      this.#splittAmounts.set(userId, DEFAULT_AMOUNT);
    });
    this.#validateForSubmission();
    this._isInitialized = true;
  };

  // Reset

  /**
   * Resets the Splitt Parts Form state by assigning the default amount
   * to each user and resetting internal totals.
   *
   * Also triggers validation for form submission.
   *
   * @returns {void}
   */
  reset = () => {
    for (const userId of this.#splittAmounts.keys()) {
      this.#splittAmounts.set(userId, DEFAULT_AMOUNT);
    }
    this.#total = 0;
    this.#remainder = 0;
    this.#validateForSubmission();
  };

  // Update

  /**
   * Updates the splitt amounts based on user input and recalculates the totals.
   *
   * @param {Object} params Update parameters.
   * @param {number} params.expenseAmount The total expense amount.
   * @param {bigint} params.userId The user ID whose splitt amount is being updated.
   * @param {number} params.value The new splitt amount for the user.
   * @returns {Object} The updated splitt state.
   */
  update = ({ expenseAmount, userId, value }) => {
    if (userId) this.#updateSplittAmounts(userId, value);
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
   * Retrieves the current splitt amounts for users.
   * @returns {Map<bigint, number>} A copy of the splitt amounts map.
   */
  getSplittAmounts = () => {
    return new Map(this.#splittAmounts);
  };

  /**
   * Retrieves the total sum of all splitt amounts.
   * @returns {number} The total sum of splitt amounts.
   */
  get total() {
    return this.#total;
  }

  /**
   * Retrieves the remainder, which is the difference between the expense amount and the total sum of splitt amounts.
   * @returns {number} The remaining amount to be allocated.
   */
  get remainder() {
    return this.#remainder;
  }

  // Prepare Output

  /**
   * Prepares the response object containing the updated splitt data.
   * @returns {Object} The response object.
   * @property {Map<bigint, number>} splittAmounts - The current splitt amounts.
   * @property {number} total The total splitt amount.
   * @property {number} remainder The remaining balance.
   * @property {boolean} isValid Whether the subform is valid for submission.
   */
  #prepareUpdateResponse = () => {
    return {
      splittAmounts: this.getSplittAmounts(),
      total: this.#total,
      remainder: this.#remainder,
      isValid: this._isValid,
    };
  };

  // Inner Logic

  /**
   * Validates if the splitt configuration is ready for submission.
   * A valid configuration has no remaining balance.
   */
  #validateForSubmission = () => {
    this._isValid = this.#remainder === 0;
  };

  /**
   * Updates the splitt amount for a specific user.
   * @param {bigint} userId The ID of the user whose splitt amount is being updated.
   * @param {number} splittAmount - The new splitt amount for the user.
   */
  #updateSplittAmounts = (userId, splittAmount) => {
    this.#splittAmounts.set(userId, splittAmount);
  };

  /**
   * Recalculates the total splitt amount and the remaining balance.
   * @param {number} expenseAmount The expense amount.
   */
  #calculateSplitts = expenseAmount => {
    const total = this.#splittAmounts
      .values()
      .reduce((acc, currentValue) => acc + currentValue, 0);

    this.#total = total;
    this.#remainder = expenseAmount - this.#total;
  };
}

export default SplittPartsState;
