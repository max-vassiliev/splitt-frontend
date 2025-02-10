import {
  getAvatarUrl,
  formatAmountForOutput,
  restyleRemainderRow,
} from '../../../../util/RenderHelper.js';
import { HIDDEN_CLASS, VISIBLE_CLASS } from '../../../../../util/Config.js';
import PaidByEntryView from './PaidByEntryView.js';

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
  #entries;
  #payerSwitchClass = '.payer__switch';
  #amountInputClass = '.payer-amount__input';
  #amountWidthOptions;
  #amountWidthDefault = '14rem';

  constructor() {
    this.#entries = new Map();
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

  // GETTERS

  get form() {
    return this.#form;
  }

  hasDefaultRow = () => {
    return this.#entries.size === 1;
  };

  // Render

  render = data => {
    const {
      entries,
      switchOptions,
      usersToDisable,
      total,
      remainder,
      expenseAmount,
      disableAddButton,
    } = data;

    const { defaultEntry, otherEntries } = entries;
    const defaultEntryData = {
      entry: defaultEntry,
      switchOptions,
      usersToDisable,
      isFirstRow: true,
    };

    this.#clearEntries();
    this.#renderDefaultEntry(defaultEntryData);
    this.#renderEntries(otherEntries, switchOptions, usersToDisable);
    this.#renderAddPayerButton(disableAddButton);
    this.#renderCalculationRows(total, remainder, expenseAmount);
  };

  #renderDefaultEntry = entryData => {
    this.#renderEntry(entryData);
  };

  #renderEntries = (entryModels, switchOptions, usersToDisable) => {
    if (!Array.isArray(entryModels) || entryModels.length === 0) return;
    entryModels.forEach(entryModel => {
      this.#renderEntry({ entry: entryModel, switchOptions, usersToDisable });
    });
  };

  #renderEntry = data => {
    const { entry, switchOptions, usersToDisable, isFirstRow = false } = data;
    if (!entry) return;
    const { userId, entryId } = entry;
    const payerOptionsHTML = this.#generatePayerOptionsHTML(
      switchOptions,
      userId,
      usersToDisable
    );

    const rowHTML = this.#generateNewRowHTML({
      payerOptionsHTML,
      isFirstRow,
      ...entry,
    });

    this.#addPayerRow.insertAdjacentHTML('beforebegin', rowHTML);
    const rowElement = this.#addPayerRow.previousElementSibling;
    this.#addRowToEntries(rowElement, entryId);
  };

  #renderCalculationRows = (total, remainder, expenseAmount) => {
    this.#totalElement.textContent = formatAmountForOutput(total);
    this.#remainderElement.textContent = formatAmountForOutput(remainder);

    this.#totalRow.style.visibility =
      remainder === 0 ? HIDDEN_CLASS : VISIBLE_CLASS;
    restyleRemainderRow(remainder, this.#remainderRow);

    this.#adjustAmountInputWidth(total, expenseAmount);
  };

  #renderAddPayerButton = (shouldHide = false) => {
    if (shouldHide) {
      this.#addPayerButton.classList.add(HIDDEN_CLASS);
    } else {
      this.#addPayerButton.classList.remove(HIDDEN_CLASS);
    }
  };

  #adjustAmountInputWidth = (total, expenseAmount) => {
    const referenceAmount = expenseAmount > total ? expenseAmount : total;
    const referenceAmountLength = referenceAmount.toString().length;
    const adjustedWidth =
      this.#amountWidthOptions.get(referenceAmountLength) ||
      this.#amountWidthDefault;

    const amountInputElements = Array.from(this.#entries.values()).map(
      entry => entry.amountInput
    );
    amountInputElements.forEach(inputElement => {
      inputElement.style.width = adjustedWidth;
    });
  };

  // Add / Delete Row

  // Generate HTML

  #generatePayerOptionsHTML = (switchOptions, payerId, usersToDisable) => {
    let payerOptionsHTML = '';

    switchOptions.forEach((name, id) => {
      let disabledAttribute;
      let selectedAttribute;

      if (id === payerId) {
        selectedAttribute = ' selected';
        disabledAttribute = '';
      } else {
        selectedAttribute = '';
        disabledAttribute = usersToDisable.has(id) ? ' disabled' : '';
      }

      payerOptionsHTML += `<option value="${id}"${disabledAttribute}${selectedAttribute}>${name}</option>\n`;
    });

    return payerOptionsHTML;
  };

  #generateNewRowHTML = ({
    payerOptionsHTML,
    entryId,
    userId,
    avatar,
    amount,
    isFirstRow,
  }) => {
    const avatarUrl = getAvatarUrl(avatar);
    const dataUserId = userId ? ` data-user-id="${userId}"` : '';
    const removeColumnAttribute = isFirstRow ? ' inactive' : '';
    const outputAmount = formatAmountForOutput(amount);

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

  // Utility

  #clearEntries = () => {
    while (this.#addPayerRow.previousElementSibling) {
      this.#addPayerRow.previousElementSibling.remove();
    }
    this.#entries.clear();
  };

  #addRowToEntries = (rowElement, entryId, userId = null) => {
    const payerSwitch = rowElement.querySelector(this.#payerSwitchClass);
    const amountInput = rowElement.querySelector(this.#amountInputClass);
    const entry = new PaidByEntryView(entryId, payerSwitch, amountInput);
    if (userId) entry.userId = userId;
    this.#entries.set(entryId, entry);
  };

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
