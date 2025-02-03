import {
  getAvatarUrl,
  formatAmountForOutput,
} from '../../../util/RenderHelper.js';
import {
  DEFAULT_AMOUNT,
  DEFAULT_AVATAR,
  HIDDEN_CLASS,
} from '../../../../util/Config.js';

class ExpensePaidByView {
  #form;
  #table;
  #rows;
  #payerSwitches;
  #avatarColumns;
  #addPayerRow;
  #addPayerButton;
  #totalElement;
  #totalRow;
  #remainderElement;
  #remainderRow;
  #btnClose;
  #amountWidthOptions;

  constructor() {
    this.#parseFormElements();
    this.#initAmountWidthOptions();
  }

  #parseFormElements = () => {
    this.#form = document.querySelector('.add-expense__form_payer');
    this.#table = document.querySelector('.payer-table');
    this.#rows = document.querySelectorAll('.payer-table-row');
    this.#payerSwitches = document.querySelectorAll('.payer__switch');
    this.#avatarColumns = document.querySelectorAll(
      '.payer-table-column__avatar'
    );
    this.#addPayerRow = document.querySelector('.payer-table-row__add-payer');
    this.#addPayerButton = document.querySelector('.add-payer-button');
    this.#totalElement = document.querySelector(
      '.payer-table-column__total-amount'
    );
    this.#totalRow = document.querySelector('.payer-table-row__total');
    this.#remainderElement = document.querySelector(
      '.payer-table-column__remainder-amount'
    );
    this.#remainderRow = document.querySelector('.payer-table-row__remainder');
    this.#btnClose = this.#form.querySelector('.add-expense__form_btn-close');
  };

  #initAmountWidthOptions = () => {
    this.#amountWidthOptions = new Map([
      [1, '8rem'],
      [2, '8rem'],
      [3, '8rem'],
      [4, '8rem'],
      [5, '8rem'],
      [6, '9.5rem'],
      [7, '10.5rem'],
      [8, '11.5rem'],
      [9, '13.8rem'],
      [10, '14.5rem'],
      [11, '15.5rem'],
    ]);
  };

  // TODO!
  // Add Row
  // Delete Row

  // LOAD

  loadDefaultEntry = data => {
    const {
      users,
      currentUser,
      paidByData: { defaultEntryId: entryId, disableAddButton },
    } = data;

    const payerOptionsHTML = this.#generateDefaultEntryOptionsHTML(
      users,
      currentUser.id
    );

    const rowHTML = this.#generateNewRowHTML({
      payerOptionsHTML,
      entryId,
      userId: currentUser.id,
      avatar: currentUser.avatar,
      isFirstRow: true,
    });

    this.#addPayerRow.insertAdjacentHTML('beforebegin', rowHTML);
    this.#updateAddPayerButton(disableAddButton);

    // TODO! проверить необходимость этого кода
    // const defaultPayerRow = addPayerRow.previousElementSibling;
    // addEventListenersToPayerRow(defaultPayerRow, true);
    // addPayerRowToModel(defaultPayerRow);
  };

  #updateAddPayerButton = (shouldHide = false) => {
    if (!shouldHide) return;
    this.#addPayerButton.classList.add(HIDDEN_CLASS);
  };

  #generateDefaultEntryOptionsHTML = (users, currentUserId) => {
    let payerOptionsHTML = '';

    users.forEach(user => {
      const { id, name } = user;
      const selectedAttribute = id === currentUserId ? ' selected' : '';
      payerOptionsHTML += `<option value="${id}"${selectedAttribute}>${name}</option>\n`;
    });

    return payerOptionsHTML;
  };

  #generatePayerOptionsHTML = ({ users, usersToDisable }) => {
    let payerOptionsHTML = '';

    users.forEach(user => {
      const { id, name } = user;
      const disabledAttribute = usersToDisable.has(id) ? ' disabled' : '';
      payerOptionsHTML += `<option value="${id}"${disabledAttribute}>${name}</option>\n`;
    });

    return payerOptionsHTML;
  };

  #generateNewRowHTML = ({
    payerOptionsHTML,
    entryId,
    userId,
    avatar,
    isFirstRow,
  }) => {
    const avatarUrl = avatar
      ? getAvatarUrl(avatar)
      : getAvatarUrl(DEFAULT_AVATAR);
    const dataUserId = userId ? ` data-user-id="${userId}"` : '';
    const removeColumnAttribute = isFirstRow ? ' inactive' : '';
    const outputAmount = formatAmountForOutput(DEFAULT_AMOUNT, {
      showSign: true,
    });

    return `
        <tr class="payer-table-row" data-entry-id="${entryId}"${dataUserId}>
          <td class="payer-table-column__remove-payer${removeColumnAttribute}">
            <div class="remove-payer-button" title="удалить">
              &times;
            </div>
          </td>
          <td class="payer-table-column__avatar">
            <img
              class="account__avatar"
              src="${avatarUrl}"
            />
          </td>
          <td class="payer-table-column__username">
            <select class="payer__switch">
              <option value="" disabled selected>-- выбрать --</option>
              ${payerOptionsHTML}
            </select>
          </td>
          <td class="payer-table-column__amount">
            <input
              class="payer-amount__input input-amount"
              name="expense-payer-amount-input"
              type="text"
              value="${outputAmount}"
            />
          </td>
        </tr>`;
  };

  // GETTERS

  get form() {
    return this.#form;
  }

  // ADD HANDLERS

  addHandlerTableClick = handler => {
    this.#table.addEventListener('click', handler);
  };

  addHandlerTableChange = handler => {
    this.#table.addEventListener('change', handler);
  };

  addHandlerTableInput = handler => {
    this.#table.addEventListener('input', handler);
  };

  // TODO! ред.:
  // наверное, этот
  addHandlerPayerAvatarClick = handler => {
    [...this.#avatarColumns].forEach(column => {
      column.addEventListener('click', handler);
    });
  };

  addHandlerPayerSwitch = handler => {
    [...this.#payerSwitches].forEach(payerSwitch => {
      payerSwitch.addEventListener('change', handler);
    });
  };

  addHandlerPayerButton = handler => {
    this.#addPayerButton.addEventListener('click', handler);
  };

  // TODO! amount input?
}

export default new ExpensePaidByView();
