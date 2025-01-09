import Expense from '../../model/transaction/Expense.js';
import {
  formatAmountForOutput,
  formatDateForDisplay,
  getAmountColor,
} from '../util/RenderHelper.js';

class ExpenseRowView {
  #data;
  #emptyBalance = '—';

  /**
   * Generates the HTML for an expense row.
   * @param {Object} data - The data object with an Expense instance and, preferably, locale and currencySymbol.
   * @returns {string} - The generated HTML string.
   */
  generateRowHTML(data) {
    this.#validate(data);
    this.#data = data;
    const formattedData = this.#getFormattedData();

    return this.#getHTML(formattedData);
  }

  /**
   * Validates the expense data.
   * @param {Object} data - The expense data object.
   * @throws Will throw an error if the data is invalid.
   */
  #validate(data) {
    if (typeof data !== 'object' || data === null) {
      throw new Error(
        `Invalid data type. Expected an object. Received: ${data} (type: ${typeof data})`
      );
    }

    if (!(data.expense instanceof Expense)) {
      throw new Error(
        `Invalid Expense field. Expected an instance of Expense. Received: ${
          data.expense
        } (type: ${typeof data.expense})`
      );
    }
  }

  /**
   * Formats the expense data for rendering.
   * @returns {Object} The formatted data object.
   */
  #getFormattedData() {
    const date = formatDateForDisplay(this.#data.expense.date);
    const amount = this.#getFormattedAmount();
    const balance = this.#getFormattedBalance();
    const balanceColor = getAmountColor(this.#data.expense.currentUserBalance);

    return {
      title: this.#data.expense.title,
      emoji: this.#data.expense.emoji,
      date,
      amount,
      balance,
      balanceColor,
    };
  }

  /**
   * Gets the formatted amount.
   * @returns {string} The formatted amount.
   */
  #getFormattedAmount() {
    return formatAmountForOutput(this.#data.expense.amount, {
      locale: this.#data.locale,
      currencySymbol: this.#data.currencySymbol,
    });
  }

  /**
   * Gets the formatted balance for the current user.
   * @returns {string} The formatted balance.
   */
  #getFormattedBalance() {
    return this.#data.expense.currentUserBalance
      ? formatAmountForOutput(this.#data.expense.currentUserBalance, {
          locale: this.#data.locale,
          currencySymbol: this.#data.currencySymbol,
          showSign: true,
        })
      : this.#emptyBalance;
  }

  /**
   * Generates the HTML for an expense row.
   * @param {Object} rowData The object with formatted row data.
   * @returns {string} The generated HTML string.
   */
  #getHTML(rowData) {
    return `
        <tr class="transactions-table__row" title="редактировать">
          <td class="transactions-table__delete" title="удалить">
            <div
              class="transactions-table__delete-btn material-symbols-outlined"
            >
              delete
            </div>
          </td>
          <td class="transactions-table__date">${rowData.date}</td>
          <td class="transactions-table__icon">${rowData.emoji}</td>
          <td class="transactions-table__title">${rowData.title}</td>
          <td class="transactions-table__amount-total">
            ${rowData.amount}
          </td>
          <td
            class="transactions-table__amount-share ${rowData.balanceColor}"
          >
            ${rowData.balance}
          </td>
        </tr>
    `;
  }
}

export default new ExpenseRowView();
