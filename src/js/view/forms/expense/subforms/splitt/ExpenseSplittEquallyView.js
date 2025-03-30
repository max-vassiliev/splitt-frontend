import {
  formatAmountForOutput,
  getAvatarUrl,
} from '../../../../util/RenderHelper.js';
import { INACTIVE_CLASS } from '../../../../../util/Config.js';

class ExpenseSplittEquallyView {
  #container;
  #table;
  #rows;
  #checkboxes;
  #selectors;

  constructor() {
    this.#rows = new Map();
    this.#initSelectors();
    this.#parseFormElements();
  }

  #parseFormElements = () => {
    this.#container = document.getElementById('splitt-equally-table');
    this.#table = document.querySelector('.splitt-form__equally');
  };

  #parseUserRows = users => {
    users.forEach(user => {
      const row = this.#table.querySelector(`[data-user-id="${user.id}"]`);
      if (!row) return;
      this.#rows.set(user.id, {
        row,
        checkbox: row.querySelector('.splitt-equally-checkbox'),
        amountCell: row.querySelector('.splitt-equally-column__amount'),
      });
    });
  };

  #initSelectors = () => {
    this.#selectors = {
      ROW: '.splitt-equally__row',
      CHECKBOX: '.splitt-equally-checkbox',
    };
  };

  // GETTERS

  get container() {
    return this.#container;
  }

  getSelectors = () => {
    return this.#selectors;
  };

  // RENDER

  render = data => {
    this.#renderRows(data);
  };

  // Render After Update

  renderAfterSplittUpdate = data => {};

  // Render: Elements

  #renderRows = data => {
    const { splittAmounts, selectedUsers } = data;
    splittAmounts.forEach((amount, userId) => {
      const { checkbox, amountCell, row } = this.#rows.get(userId);
      checkbox.checked = selectedUsers.has(userId);
      amountCell.textContent = formatAmountForOutput(amount);
      this.#toggleRowActiveView(row, checkbox.checked);
    });
  };

  #toggleRowActiveView = (row, isActive) => {
    if (isActive) {
      row.classList.remove(INACTIVE_CLASS);
    } else {
      row.classList.add(INACTIVE_CLASS);
    }
  };

  // LOAD

  loadUsers = data => {
    const { users } = data;
    const rowsHTML = this.#generateUserRowsHTML(users);
    this.#table.insertAdjacentHTML('afterbegin', rowsHTML);
    this.#parseUserRows(users);
  };

  #generateUserRowsHTML = users => {
    let userRowsHTML = '';
    users.forEach(user => {
      const rowHTML = this.#generateRowHTML(user);
      userRowsHTML += rowHTML;
    });
    return userRowsHTML;
  };

  #generateRowHTML = user => {
    const { id, name, avatar, amount } = user;

    const avatarUrl = getAvatarUrl(avatar);
    const formattedAmount = formatAmountForOutput(amount);

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
