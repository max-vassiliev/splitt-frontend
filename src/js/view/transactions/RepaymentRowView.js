import Repayment from '../../model/repayment/Repayment.js';
import {
  formatAmountForOutput,
  formatDateForDisplay,
  getAmountColor,
} from '../util/RenderHelper.js';

class RepaymentRowView {
  #data;
  #currentUserPayerName = 'вы';
  #currentUserRecipientName = 'вам';
  #emptyBalance = '—';

  /**
   * Generates the HTML for a repayment row.
   * @param {Object} data - The data object with a Repayment instance and, preferably, locale and currencySymbol.
   * @returns {string} - The generated HTML string.
   */
  generateRowHTML(data) {
    this.#validate(data);
    this.#data = data;
    const formattedData = this.#getFormattedData();

    return this.#getHTML(formattedData);
  }

  /**
   * Validates the repayment data.
   * @param {Object} data - The repayment data object.
   * @throws Will throw an error if the data is invalid.
   */
  #validate(data) {
    if (typeof data !== 'object' || data === null) {
      throw new Error(
        `Invalid data type. Expected an object. Received: ${data} (type: ${typeof data})`
      );
    }

    if (!(data.repayment instanceof Repayment)) {
      throw new Error(
        `Invalid Repayment field. Expected an instance of Repayment. Received: ${
          data.repayment
        } (type: ${typeof data.repayment})`
      );
    }
  }

  /**
   * Formats the repayment data for rendering.
   * @returns {Object} - The formatted data object.
   */
  #getFormattedData() {
    const date = formatDateForDisplay(this.#data.repayment.date);
    const payerName = this.#getPayerName();
    const recipientName = this.#getRecipientName();
    const amount = this.#getFormattedAmount();
    const balance = this.#getFormattedBalance();
    const balanceColor = getAmountColor(
      this.#data.repayment.currentUserBalance
    );

    return {
      date,
      payerName,
      recipientName,
      amount,
      balance,
      balanceColor,
      emoji: this.#data.repayment.emoji,
    };
  }

  /**
   * Gets the formatted payer name.
   * @returns {string} - The payer's name.
   */
  #getPayerName() {
    return this.#data.repayment.payer.isCurrentUser
      ? this.#currentUserPayerName
      : this.#data.repayment.payer.name;
  }

  /**
   * Gets the formatted recipient name.
   * @returns {string} - The recipient's name.
   */
  #getRecipientName() {
    return this.#data.repayment.recipient.isCurrentUser
      ? this.#currentUserRecipientName
      : this.#data.repayment.recipient.name;
  }

  /**
   * Gets the formatted amount.
   * @returns {string} - The formatted amount.
   */
  #getFormattedAmount() {
    return formatAmountForOutput(this.#data.repayment.amount, {
      locale: this.#data.locale,
      currencySymbol: this.#data.currencySymbol,
    });
  }

  /**
   * Gets the formatted balance for the current user.
   * @returns {string} - The formatted balance.
   */
  #getFormattedBalance() {
    return this.#data.repayment.currentUserBalance
      ? formatAmountForOutput(this.#data.repayment.currentUserBalance, {
          locale: this.#data.locale,
          currencySymbol: this.#data.currencySymbol,
          showSign: true,
        })
      : this.#emptyBalance;
  }

  /**
   * Generates the HTML for the repayment row.
   * @param {Object} rowData The formatted row data.
   * @returns {string} The generated HTML string.
   */
  #getHTML(rowData) {
    return `
        <tr class="transactions-table__row repayment" title="редактировать" data-transaction-id="${
          this.#data.repayment.id
        }">
          <td class="transactions-table__delete" title="удалить">
            <div
              class="transactions-table__delete-btn material-symbols-outlined"
            >
              delete
            </div>
          </td>
          <td class="transactions-table__date">${rowData.date}</td>
          <td class="transactions-table__icon">${rowData.emoji}</td>
          <td class="transactions-table__title">
            Возврат:
            <span class="movements__repayment--destination">
              ${rowData.payerName} &rarr; ${rowData.recipientName}
            </span>
          </td>
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

export default new RepaymentRowView();
