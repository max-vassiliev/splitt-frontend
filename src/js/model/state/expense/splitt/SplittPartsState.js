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

  // Update

  /**
   * Updates the splitt amounts based on user input and recalculates the totals.
   *
   * @param {Object} params Update parameters.
   * @param {number} params.expenseAmount The total expense amount.
   * @param {bigint} params.userId The user ID whose splitt amount is being updated.
   * @param {number} params.splittAmount The new splitt amount for the user.
   *
   * @returns {Object} The updated splitt state.
   * @property {Map<bigint, number>} splittAmounts The updated splitt amounts.
   * @property {number} total The total assigned splitt amount.
   * @property {number} remainder The remaining balance after assignment.
   * @property {boolean} isValid Whether the splitt configuration is valid.
   */
  update = ({ expenseAmount, userId, splittAmount }) => {
    if (userId) this.#updateSplittAmounts(userId, splittAmount);
    this.#calculateSplitts(expenseAmount);
    this.#validateForSubmission();
    return this.#prepareUpdateResponse();
  };

  // Getters

  /**
   * Retrieves the current splitt amounts for users.
   * @returns {Map<bigint, number>} A copy of the splitt amounts map.
   */
  getSplittAmounts = () => {
    return new Map(this.#splittAmounts);
  };

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
