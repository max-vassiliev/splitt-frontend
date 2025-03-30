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
   * @param {number} params.value - The new splitt share (percentage) for the user.
   *
   * @returns {Object} The response object with updated splitt state.
   */
  update = ({ expenseAmount, userId, value }) => {
    if (userId) this.#updateSplitts(expenseAmount, userId, value);
    if (!userId) this.#updateAmounts(expenseAmount);
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
    this.#updateAmounts(expenseAmount);
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
    let splittAmount;

    const currentUserShare = this.#splittShares.get(userId);
    const currentTotalShare = currentUserShare
      ? this.#totalShare - currentUserShare
      : this.#totalShare;

    if (currentTotalShare + splittShare === ONE_HUNDRED_PERCENT) {
      splittAmount = this.#calculateSplittAmountFromTotal(
        userId,
        expenseAmount
      );
    } else {
      splittAmount = this.#calculateSplittAmount(expenseAmount, splittShare);
    }

    this.#splittAmounts.set(userId, splittAmount);
    this.#splittShares.set(userId, splittShare);
  };

  /**
   * Updates the amounts assigned to users based on their shares.
   * @param {number} expenseAmount The total expense amount.
   */
  #updateAmounts = expenseAmount => {
    let totalAssigned = 0;
    let usersWithAmounts = [];

    this.#splittShares.forEach((splittShare, userId) => {
      if (splittShare === DEFAULT_AMOUNT || expenseAmount === DEFAULT_AMOUNT) {
        this.#splittAmounts.set(userId, DEFAULT_AMOUNT);
        return;
      }
      const updatedAmount = this.#calculateSplittAmount(
        expenseAmount,
        splittShare
      );
      this.#splittAmounts.set(userId, updatedAmount);

      totalAssigned += updatedAmount;
      usersWithAmounts.push(userId);
    });

    this.#correctRoundingError(expenseAmount, totalAssigned, usersWithAmounts);
  };

  /**
   * Corrects any rounding errors in the assigned amounts by distributing the difference among users.
   * @param {number} expenseAmount The total expense amount.
   * @param {number} totalAssigned The total amount assigned before rounding correction.
   * @param {bigint[]} usersWithAmounts List of user IDs with assigned amounts above 0.
   */
  #correctRoundingError = (expenseAmount, totalAssigned, usersWithAmounts) => {
    if (
      this.#totalShare !== ONE_HUNDRED_PERCENT ||
      usersWithAmounts.length === 0
    ) {
      return;
    }

    let roundingError = expenseAmount - totalAssigned;
    if (roundingError === 0) return;

    const usersToAdjust = new Set();

    while (usersToAdjust.size < Math.abs(roundingError)) {
      const randomIndex = Math.floor(Math.random() * usersWithAmounts.length);
      usersToAdjust.add(usersWithAmounts[randomIndex]);
    }

    usersToAdjust.forEach(userId => {
      this.#splittAmounts.set(
        userId,
        this.#splittAmounts.get(userId) + Math.sign(roundingError)
      );
    });
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
   * Calculates the splitt amount for a user when the total share is 100%.
   * Ensures the last user's amount is calculated correctly to match the total expense amount.
   * @param {bigint} userId The user ID whose amount is being calculated.
   * @param {number} expenseAmount The total expense amount.
   * @returns {number} The calculated splitt amount for the user.
   */
  #calculateSplittAmountFromTotal = (userId, expenseAmount) => {
    const currentUserAmount = this.#splittAmounts.get(userId);
    const currentTotalAmount = currentUserAmount
      ? this.#totalAmount - currentUserAmount
      : this.#totalAmount;

    return expenseAmount - currentTotalAmount;
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
