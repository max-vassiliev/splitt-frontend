import {
  getAvatarUrl,
  getAmountColor,
  formatAmountForOutput,
} from '../util/RenderHelper.js';

class GroupSummaryView {
  #container;
  #emptyBalance = '—';

  constructor() {
    this.#container = document.querySelector('.group-summary-container');
  }

  // Render

  render(data) {
    if (!data || !Array.isArray(data.balances)) {
      console.error('Invalid data format for group summary rendering');
      return;
    }

    const tableHTML = this.#generateTableHTML(data);
    this.#clear();
    this.#container.insertAdjacentHTML('afterbegin', tableHTML);
  }

  renderLoading = () => {
    const loadingHTML = this.#generateLoadingHTML();
    this.#clear();
    this.#container.insertAdjacentHTML('afterbegin', loadingHTML);
  };

  #clear() {
    this.#container.innerHTML = '';
  }

  // Generate HTML

  #generateLoadingHTML() {
    return `<div class="summary loading"></div>`;
  }

  #generateTableHTML(data) {
    const { balances, locale, currencySymbol } = data;

    let tableHTML = `
      <div class="summary group-summary">
        <h2>Статистика группы</h2>
        <div class="summary__table">
    `;

    balances.forEach(userBalance => {
      const rowData = {
        ...userBalance,
        locale,
        currencySymbol,
      };
      const rowHTML = this.#generateNewRowHTML(rowData);
      tableHTML += rowHTML;
    });

    tableHTML += '</div></div>';
    return tableHTML;
  }

  #generateNewRowHTML(data) {
    const { userId, username, avatar, balance, locale, currencySymbol } = data;
    const avatarUrl = getAvatarUrl(avatar);
    const formattedBalance = balance
      ? formatAmountForOutput(balance, {
          locale: locale,
          currencySymbol: currencySymbol,
          showSign: true,
        })
      : this.#emptyBalance;
    const balanceColor = getAmountColor(balance);

    const rowHTML = `
        <div class="summary__table--row" data-user-id="${userId}">
          <img
            class="account__avatar"
            src="${avatarUrl}"
            alt="${username}"
          />
          <div class="summary__table--user">${username}</div>
          <div class="summary__table--amount ${balanceColor}">
            ${formattedBalance}
          </div>
        </div>`;

    return rowHTML;
  }
}

export default new GroupSummaryView();
