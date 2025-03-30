import {
  EXPENSE_SPLITT_TYPES,
  EXPENSE_SPLITT_EQUALLY,
  EXPENSE_SPLITT_PARTS,
  EXPENSE_SPLITT_SHARES,
} from '../../../../util/Config.js';

class SplittService {
  #viewModelPreparers;

  constructor() {
    this.#initViewModelPreparers();
  }

  #initViewModelPreparers = () => {
    this.#viewModelPreparers = new Map();
    this.#viewModelPreparers.set(
      EXPENSE_SPLITT_EQUALLY,
      this.#prepareViewModelEqually
    );
    this.#viewModelPreparers.set(
      EXPENSE_SPLITT_PARTS,
      this.#prepareViewModelParts
    );
    this.#viewModelPreparers.set(
      EXPENSE_SPLITT_SHARES,
      this.#prepareViewModelShares
    );
  };

  /**
   * Prepares the view model for the Splitt subform.
   * @param {Object} splittData The state data for the Splitt subform.
   * @param {string} splittData.type The type of Splitt. One of {@link EXPENSE_SPLITT_TYPES}.
   * @returns {Object} The prepared view model.
   * @throws {Error} If no preparer is found for the given Splitt type.
   */
  prepareViewModel = splittData => {
    const prepare = this.#getViewModelPreparer(splittData.type);
    return prepare(splittData);
  };

  /**
   * Prepares the view model for the Splitt Equally type.
   * @param {Object} data The state data for the Splitt subform.
   * @param {string} data.type The type of Splitt.
   * @param {boolean} data.isValid Indicates whether the Splitt is valid.
   * @param {Function} data.getSplittAmounts A method that retrieves Splitt amounts.
   * @param {Set<bigint>} data.selectedUsers The set of selected user IDs.
   * @returns {Object} The view model for the Splitt Equally type.
   * @private
   */
  #prepareViewModelEqually = data => {
    return {
      type: data.type,
      isValid: data.isValid,
      splittAmounts: data.getSplittAmounts(),
      selectedUsers: data.selectedUsers,
    };
  };

  /**
   * Prepares the view model for the Splitt Parts type.
   * @param {Object} data The state data for the Splitt subform.
   * @param {string} data.type The type of Splitt.
   * @param {boolean} data.isValid Indicates whether the Splitt is valid.
   * @param {Function} data.getSplittAmounts A method that retrieves Splitt amounts.
   * @param {number} data.total The total sum of Splitt amounts.
   * @param {number} data.remainder The remainder, the difference between the expense amount and total.
   * @returns {Object} The view model for the Splitt Parts type.
   * @private
   */
  #prepareViewModelParts = data => {
    return {
      type: data.type,
      isValid: data.isValid,
      splittAmounts: data.getSplittAmounts(),
      total: data.total,
      remainder: data.remainder,
    };
  };

  /**
   * Prepares the view model for the Splitt Shares type.
   * @param {Object} data The state data for the Splitt subform.
   * @param {string} data.type The type of Splitt.
   * @param {boolean} data.isValid Indicates whether the Splitt is valid.
   * @param {Function} data.getSplittShares A method that retrieves Splitt shares.
   * @param {Function} data.getSplittAmounts A method that retrieves Splitt amounts.
   * @param {number} data.totalShare The total share of Splitt shares.
   * @param {number} data.totalAmount The total sum of Splitt amounts.
   * @param {number} data.remainderShare The remaining shares to be assigned.
   * @param {number} data.remainderAmount The remainder, the difference between the expense amount and total amount.
   * @returns {Object} The view model for the Splitt Shares type.
   * @private
   */
  #prepareViewModelShares = data => {
    return {
      type: data.type,
      isValid: data.isValid,
      splittShares: data.getSplittShares(),
      splittAmounts: data.getSplittAmounts(),
      totalShare: data.totalShare,
      totalAmount: data.totalAmount,
      remainderShare: data.remainderShare,
      remainderAmount: data.remainderAmount,
    };
  };

  /**
   * Retrieves the appropriate view model preparer function for a given Splitt type.
   * @param {string} splittType The Splitt type. One of {@link EXPENSE_SPLITT_TYPES}.
   * @returns {Function} The corresponding view model preparer function.
   * @throws {Error} If no preparer function is found for the given Splitt type.
   * @private
   */
  #getViewModelPreparer = splittType => {
    const preparer = this.#viewModelPreparers.get(splittType);
    if (!preparer) {
      throw new Error(
        `Splitt view model preparer not found for value: ${splittType} (${typeof splittType}).`
      );
    }
    return preparer;
  };
}

export default new SplittService();
