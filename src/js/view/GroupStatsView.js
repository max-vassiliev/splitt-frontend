import {
  getAvatarUrl,
  getAmountColor,
  formatAmountForOutput,
} from './util/RenderHelper.js';

class GroupStatsView {
  #groupStatsContainer;

  constructor() {
    this.#groupStatsContainer = document.querySelector(
      '.group-stats-container'
    );
  }

  renderGroupStats(data) {
    if (!data || !Array.isArray(data.balances)) {
      console.error('Invalid data format for group stats rendering');
      return;
    }

    const tableHTML = this.#generateTableHTML(data);
    this.#clear;
    this.#groupStatsContainer.insertAdjacentHTML('afterbegin', tableHTML);
  }

  #clear() {
    this.#groupStatsContainer.innerHTML = '';
  }

  #generateTableHTML(data) {
    const { balances, locale, currencySymbol } = data;

    let tableHTML = `
      <div class="summary group-stats">
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

  #generateNewRowHTML({ userBalance, locale, currencySymbol }) {
    const { userId, username, avatar, balance } = userBalance;
    const avatarUrl = getAvatarUrl(avatar);
    const formattedBalance = balance
      ? formatAmountForOutput(balance, {
          locale: locale,
          currencySymbol: currencySymbol,
          showSign: true,
        })
      : '—';
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

export default new GroupStatsView();
