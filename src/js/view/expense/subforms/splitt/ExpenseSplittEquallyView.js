import {
  formatAmountForOutput,
  getAvatarUrl,
} from '../../../util/RenderHelper.js';

class ExpenseSplittEquallyView {
  #container;
  #rows;
  #checkboxes;

  constructor() {
    this.#parseFormElements();
    // TODO! надо будет загрузить элементы
  }

  #parseFormElements = () => {
    this.#container = document.getElementById('splitt-equally-table');
    // TODO! скорее всего нужно иначе, так как каждый ряд нужно загрузить
    // this.#rows = document.querySelectorAll('.splitt-equally__row');
    // this.#checkboxes = document.querySelectorAll('.splitt-equally-checkbox');
  };

  // TODO! старый код, с которым нужно что-то сделать
  // splittEquallyTableRows.forEach(row => {
  //   const userId = row.dataset.userId;
  //   const splittField = row.querySelector('.splitt-equally-column__amount');
  //   splittEquallyModel.splittAmounts.set(userId, DEFAULT_AMOUNT);
  //   splittEquallyModel.splittFields.set(userId, splittField);
  //   splittEquallyModel.checkedRows.add(userId);
  // });

  // activate(splittEquallyTable);
  // splittEquallyModel.element = splittEquallyTable;
  // addExpenseFormModel.splitt = splittEquallyModel;

  // LOAD

  loadUsers = data => {
    console.log('splitt equally: loadUsers()');
    const tableHTML = this.#generateTableHTML(data);
    this.#container.insertAdjacentHTML('afterbegin', tableHTML);
  };

  #generateTableHTML = data => {
    const { users, displaySettings } = data;
    let tableHTML = '<table class="splitt-form__equally">';
    users.forEach(user => {
      const rowHTML = this.#generateRowHTML(user, displaySettings);
      tableHTML += rowHTML;
    });
    return tableHTML;
  };

  #generateRowHTML = (user, displaySettings) => {
    const { id, name, avatar, amount } = user;
    const { locale, currencySymbol } = displaySettings;

    const avatarUrl = getAvatarUrl(avatar);
    const formattedAmount = formatAmountForOutput(amount, {
      locale,
      currencySymbol,
      showSign: true,
    });

    return `
        <tr class="splitt-equally__row" data-user-id="${id}">
          <td class="splitt-equally-column__checkbox">
            <input
              type="checkbox"
              class="splitt-equally-checkbox"
              checked
            />
          </td>
          <td class="splitt-equally-column__avatar">
            <img
              class="account__avatar"
              src="${avatarUrl}"
              alt="${name}"
            />
          </td>
          <td class="splitt-equally-column__username">${name}</td>
          <td class="splitt-equally-column__amount">${formattedAmount}</td>
        </tr>
    `;
  };
}

export default new ExpenseSplittEquallyView();
