import Repayment from '../../model/transaction/Repayment.js';
import repaymentView from './RepaymentRowView.js';
import expenseView from './ExpenseRowView.js';

class TransactionsView {
  #container;
  #data;

  constructor() {
    this.#container = document.querySelector('.transactions__container');
  }

  /**
   * Renders the transactions data.
   * @param {Object} data - The data object containing transactions, locale and currencySymbol.
   */
  render(data) {
    this.#validate(data);

    this.#data = data;
    const transactionsHTML = this.#isTransactionsEmpty(this.#data.transactions)
      ? this.#generateTransactionsEmptyHTML()
      : this.#generateTransactionsTableHTML();

    this.#clear();
    this.#container.insertAdjacentHTML('afterbegin', transactionsHTML);
  }

  /**
   * Clears the container.
   */
  #clear() {
    this.#container.innerHTML = '';
  }

  /**
   * Adds a click event handler to the container.
   * @param {Function} handler The click event handler function.
   */
  addHandlerContainerClick(handler) {
    this.#container.addEventListener('click', handler);
  }

  /**
   * Validates the input data.
   * @param {Object} data The data object to validate.
   * @throws Will throw an error if the data is invalid.
   */
  #validate(data) {
    if (typeof data !== 'object' || data === null) {
      throw new Error(
        `Invalid data type. Expected an object. Received: ${data} (type: ${typeof data})`
      );
    }
    if (!data.transactions || !Array.isArray(data.transactions)) {
      throw new Error(
        `Invalid transactions field. Expected an array. Received: ${
          data.transactions
        } (${typeof data.transactions}).`
      );
    }
  }

  /**
   * Checks if the transactions array is empty.
   * @param {Array} transactions The transactions array.
   * @returns {boolean} True if transactions are empty, false otherwise.
   */
  #isTransactionsEmpty(transactions) {
    return transactions.length === 0;
  }

  /**
   * Generates HTML for an empty transactions state.
   * @returns {string} The generated HTML string.
   */
  #generateTransactionsEmptyHTML() {
    return `
      <div class="transactions__empty">
        <h1>Пока нет записей</h1>
        <p>
          Вы можете <span class="add-expense-link">добавить трату</span>
          <br />
          или <span class="add-repayment-link">вернуть долг</span>
        </p>
      </div>
    `;
  }

  /**
   * Generates HTML for the transactions table.
   * @returns {string} The generated HTML string.
   */
  #generateTransactionsTableHTML() {
    let tableHTML = `
        <table class="transactions-table">
          <tr class="transactions-table__annotation-row">
            <td colspan="4"></td>
            <td class="transactions-table__annotation">общая сумма</td>
            <td class="transactions-table__annotation">ваш баланс</td>
          </tr>
    `;

    this.#data.transactions.forEach(transaction => {
      const rowHTML = this.#generateTransactionRowHTML(transaction);
      tableHTML += rowHTML;
    });

    tableHTML += '</table>';
    return tableHTML;
  }

  /**
   * Generates HTML for a single transaction row.
   * @param {Object} transaction The transaction object.
   * @returns {string} The generated HTML string.
   */
  #generateTransactionRowHTML(transaction) {
    const transactionRowHTML =
      transaction instanceof Repayment
        ? this.#generateRepaymentRowHTML(transaction)
        : this.#generateExpenseRowHTML(transaction);

    return transactionRowHTML;
  }

  /**
   * Generates HTML for a repayment row.
   * @param {Repayment} repayment The repayment object.
   * @returns {string} The generated HTML string.
   */
  #generateRepaymentRowHTML(repayment) {
    return repaymentView.generateRowHTML({
      repayment,
      locale: this.#data.locale,
      currencySymbol: this.#data.currencySymbol,
    });
  }

  /**
   * Generates HTML for an expense row.
   * @param {Expense} expense The expense object.
   * @returns {string} The generated HTML string.
   */
  #generateExpenseRowHTML(expense) {
    return expenseView.generateRowHTML({
      expense,
      locale: this.#data.locale,
      currencySymbol: this.#data.currencySymbol,
    });
  }
}

export default new TransactionsView();
