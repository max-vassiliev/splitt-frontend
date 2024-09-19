import stateManager from '../state/StateManager.js';

class TransactionModel {
  /**
   * Gets the data required to load the Transactions table.
   * @returns {Object} An object containing the following fields:
   *                     - transactions: array of Expense and Repayment instances
   *                     - currencySymbol: string representing the currency symbol
   *                     - locale:
   */
  getTransactionsLoadData() {
    const transactions = stateManager.getTransactions();
    const { locale, currencySymbol } =
      stateManager.getLocaleAndCurrencySymbol();

    return { transactions, locale, currencySymbol };
  }
}

export default new TransactionModel();
