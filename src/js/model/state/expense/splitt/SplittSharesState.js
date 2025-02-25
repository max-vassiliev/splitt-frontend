import {
  EXPENSE_SPLITT_SHARES,
  DEFAULT_AMOUNT,
  ONE_HUNDRED_PERCENT,
} from '../../../../util/Config.js';
import SplittState from './SplittState.js';

class SplittSharesState extends SplittState {
  #splittAmounts;
  #splittShares;
  #totalAmount;
  #totalShare;
  #remainderAmount;
  #remainderShare;

  constructor() {
    super(EXPENSE_SPLITT_SHARES);
    this.#splittAmounts = new Map();
    this.#splittShares = new Map();
    this.#totalAmount = DEFAULT_AMOUNT;
    this.#totalShare = DEFAULT_AMOUNT;
    this.#remainderAmount = DEFAULT_AMOUNT;
    this.#remainderShare = DEFAULT_AMOUNT;
  }

  // Initialization

  /**
   * Initializes splitt amounts and shares for the given users with default values.
   * @param {bigint[]} userIds The list of user IDs to initialize with default amounts and shares.
   *                           Expected a full list of current users.
   */
  init = userIds => {
    userIds.forEach(userId => {
      this.#splittAmounts.set(userId, DEFAULT_AMOUNT);
      this.#splittShares.set(userId, DEFAULT_AMOUNT);
    });
    this.#validateForSubmission();
    this._isInitialized = true;
  };

  // Update

  /**
   * Updates the splitt amounts and shares based on user input and recalculates totals.
   *
   * @param {Object} params - Update parameters.
   * @param {number} params.expenseAmount - The expense amount.
   * @param {bigint} params.userId - The user ID whose splitt share is being updated.
   * @param {number} params.splittShare - The new splitt share (percentage) for the user.
   *
   * @returns {Object} The response object with updated splitt state.
   * @property {Map<bigint, number>} splittAmounts The updated splitt amounts.
   * @property {Map<bigint, number>} splittShares The updated splitt shares.
   * @property {number} totalAmount The total assigned splitt amount.
   * @property {number} totalShare The total assigned splitt share (percentage).
   * @property {number} remainderAmount The remaining balance after assignment.
   * @property {number} remainderShare The remaining percentage of shares to be assigned.
   * @property {boolean} isValid Whether the splitt subform is valid for submission.
   */
  update = ({ expenseAmount, userId, splittShare }) => {
    if (userId) this.#updateSplitts(expenseAmount, userId, splittShare);
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
   * Retrieves the current splitt shares for users.
   * @returns {Map<bigint, number>} A copy of the splitt shares map.
   */
  getSplittShares = () => {
    return new Map(this.#splittShares);
  };

  /**
   * Retrieves the total sum of all splitt shares.
   * @returns {number} The total sum of splitt shares.
   */
  get totalShare() {
    return this.#totalShare;
  }

  /**
   * Retrieves the total sum of all splitt amounts.
   * @returns {number} The total sum of splitt amounts.
   */
  get totalAmount() {
    return this.#totalAmount;
  }

  /**
   * Retrieves the remainder share,
   * which is the share that needs to be allocated
   * to make the total amount be equal to the expense amount.
   *
   * @returns {number} The remaining share to be allocated.
   */
  get remainderShare() {
    return this.#remainderShare;
  }

  /**
   * Retrieves the remainder amount,
   * which represents tha amount value of the remainder share.
   *
   * @returns {number} The remaining amount.
   */
  get remainderAmount() {
    return this.#remainderAmount;
  }

  // Prepare Output

  /**
   * Prepares the response object containing the updated splitt data.
   *
   * @returns {Object} The response object.
   * @property {Map<bigint, number>} splittAmounts - The current splitt amounts.
   * @property {Map<bigint, number>} splittShares - The current splitt shares.
   * @property {number} totalAmount - The total splitt amount.
   * @property {number} totalShare - The total assigned splitt share (percentage).
   * @property {number} remainderAmount - The remaining balance.
   * @property {number} remainderShare - The remaining percentage of shares to be assigned.
   * @property {boolean} isValid - Whether the subform is valid for submission.
   */
  #prepareUpdateResponse = () => {
    return {
      splittAmounts: this.getSplittAmounts(),
      splittShares: this.getSplittShares(),
      totalAmount: this.#totalAmount,
      totalShare: this.#totalShare,
      remainderAmount: this.#remainderAmount,
      remainderShare: this.#remainderShare,
      isValid: this._isValid,
    };
  };

  // Inner Logic

  /**
   * Validates if the subform is ready for submission.
   * A valid configuration has no remaining balance.
   */
  #validateForSubmission = () => {
    this._isValid = this.#remainderAmount === 0;
  };

  /**
   * Updates the splitt amount and share for a specific user.
   * @param {number} expenseAmount The expense amount.
   * @param {bigint} userId The user ID whose splitt share is being updated.
   * @param {number} splittShare The new splitt share (percentage) for the user.
   */
  #updateSplitts = (expenseAmount, userId, splittShare) => {
    const splittAmount = this.#calculateSplittAmount(
      expenseAmount,
      splittShare
    );
    this.#splittAmounts.set(userId, splittAmount);
    this.#splittShares.set(userId, splittShare);
  };

  /**
   * Calculates the splitt amount based on the expense amount and the user's share.
   * @param {number} expenseAmount - The expense amount.
   * @param {number} splittShare - The user's assigned share (percentage).
   * @returns {number} The calculated splitt amount.
   */
  #calculateSplittAmount = (expenseAmount, splittShare) => {
    return Math.round((expenseAmount * splittShare) / ONE_HUNDRED_PERCENT);
  };

  /**
   * Recalculates the total and remainder values.
   * @param {number} expenseAmount - The expense amount.
   */
  #calculateSplitts = expenseAmount => {
    this.#totalAmount = this.#splittAmounts
      .values()
      .reduce((acc, currentValue) => acc + currentValue, 0);

    this.#totalShare = this.#splittShares
      .values()
      .reduce((acc, currentValue) => acc + currentValue, 0);

    this.#remainderAmount = expenseAmount - this.#totalAmount;
    this.#remainderShare =
      expenseAmount === 0 ? 0 : ONE_HUNDRED_PERCENT - this.#totalShare;
  };
}

export default SplittSharesState;
