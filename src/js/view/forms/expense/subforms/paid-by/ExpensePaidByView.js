import {
  getAvatarUrl,
  formatAmountForOutput,
  restyleRemainderRow,
  adjustAmountElementsWidth,
  setAmountCursorPosition,
} from '../../../../util/RenderHelper.js';
import TypeParser from '../../../../../util/TypeParser.js';
import {
  HIDDEN_CLASS,
  VISIBLE_CLASS,
  EXPENSE_PAID_BY_OPTION_EMPTY_ID,
  MIN_EXPENSE_AMOUNT,
} from '../../../../../util/Config.js';
import PaidByEntryView from './PaidByEntryView.js';

class ExpensePaidByView {
  #form;
  #table;
  #selectors;
  #addPayerRow;
  #addPayerButton;
  #totalElement;
  #totalRow;
  #remainderElement;
  #remainderRow;
  #btnClose;
  #entries;
  #entriesAll;
  #payerSwitchClass = '.payer__switch';
  #amountInputClass = '.payer-amount__input';
  #amountWidthOptions;
  #amountWidthDefault = '14rem';

  constructor() {
    this.#entries = new Map();
    this.#entriesAll = new Map();
    this.#parseFormElements();
    this.#initSelectors();
    this.#initAmountWidthOptions();
  }

  #parseFormElements = () => {
    this.#form = document.querySelector('.add-expense__form_payer');
    this.#table = document.querySelector('.payer-table');
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

  #initSelectors = () => {
    this.#selectors = {
      TABLE: '.payer-table',
      PAYER_SWITCH: '.payer__switch',
      PAYER_AVATAR_CELL: '.payer-table-column__avatar',
      PAYER_AVATAR: '.account__avatar',
      PAYER_AMOUNT_INPUT: '.payer-amount__input',
      PAYER_ROW: '.payer-table-row',
      ADD_PAYER_ROW: '.payer-table-row__add-payer',
      ADD_PAYER_BUTTON: '.add-payer-button',
      REMOVE_PAYER_CELL: '.payer-table-column__remove-payer',
    };
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

  getSelectors = () => {
    return this.#selectors;
  };

  hasDefaultRow = () => {
    return this.#entries.size === 1;
  };

  setup = data => {
    const { defaultEntryAdd, ...rest } = data;
    this.#renderEntry({ entry: defaultEntryAdd, isFirstRow: true, ...rest });
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
      hasSingleEntry,
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
    if (!hasSingleEntry) {
      this.#renderEntries(otherEntries, switchOptions, usersToDisable);
    }
    this.#renderAddPayerButton(disableAddButton);
    this.#renderCalculationRows(total, remainder, expenseAmount);
  };

  // Render After Update

  renderAfterExpenseAmountChange = data => {
    const { hasSingleEntry, total, remainder, expenseAmount } = data;
    if (hasSingleEntry) {
      const { defaultEntryAmount } = data;
      const defaultEntry = this.#entries.values().next().value;
      defaultEntry.amountInput.value =
        formatAmountForOutput(defaultEntryAmount);
    }
    this.#renderCalculationRows(total, remainder, expenseAmount);
  };

  renderAfterUpdatePayerAmount = data => {
    const {
      entryId,
      amount,
      total,
      remainder,
      inputAmount,
      expenseAmount,
      cursorPosition,
    } = data;
    const entry = this.#entriesAll.get(entryId);

    entry.renderAmount(amount);
    const inputElement = entry.amountInput;
    setAmountCursorPosition({
      amountIn: inputAmount,
      amountOut: inputElement.value,
      cursorPosition,
      inputElement,
    });

    this.#renderCalculationRows(total, remainder, expenseAmount);
  };

  renderAfterUpdatePayer = data => {
    const { avatar, entryId, addedUserId, removedUserId } = data;
    this.#renderAvatar(entryId, avatar);
    this.#updateEntryUserId(entryId, addedUserId);
    this.#updatePayerSwitchesAfterPayerChange(addedUserId, removedUserId);
  };

  renderAfterAddPayerRow = data => {
    const {
      entry,
      switchOptions,
      usersToDisable,
      deactivateAddPayerButton,
      isDefaultEntryAffected,
    } = data;

    this.#renderEntry({ entry, switchOptions, usersToDisable });

    if (isDefaultEntryAffected) {
      const defaultEntry = this.#entries.get(data.defaultEntryId);
      defaultEntry.activateInput();
    }
    if (deactivateAddPayerButton) {
      this.#renderAddPayerButton(true);
    }
  };

  renderAfterRemovePayerRow = data => {
    const {
      entryId,
      removedUserId,
      isRecalculated,
      calculationRowData,
      isDefaultEntryAffected,
      defaultEntryData,
    } = data;

    this.#clearEntry(entryId);
    this.#entries.forEach(entry => entry.activatePayerOption(removedUserId));
    this.#renderAddPayerButton();

    if (isRecalculated) {
      const { total, remainder, expenseAmount } = calculationRowData;
      this.#renderCalculationRows(total, remainder, expenseAmount);
    }

    if (isDefaultEntryAffected) {
      const { defaultEntryId, expenseAmount } = defaultEntryData;
      const defaultEntry = this.#entriesAll.get(defaultEntryId);
      defaultEntry.renderAmount(expenseAmount, true, true);
    }
  };

  renderAfterPayerAvatarClick = entryId => {
    const entry = this.#entriesAll.get(entryId);
    entry.focusInput();
  };

  // Render: Elements

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
    const entryId = data.entry.entryId;
    const entryView = this.#entriesAll.get(entryId);

    if (!entryView) {
      this.#createEntry(data);
      return;
    }

    data.entry.usersToDisable = data.usersToDisable;
    entryView.render(data.entry);
    this.#entries.set(entryId, entryView);
    this.#addPayerRow.before(entryView.rowElement);
  };

  #renderAvatar = (entryId, avatar) => {
    const entry = this.#entries.get(entryId);
    entry.avatarElement.src = getAvatarUrl(avatar);
  };

  #renderCalculationRows = (total, remainder, expenseAmount) => {
    this.#totalElement.textContent = formatAmountForOutput(total);
    this.#remainderElement.textContent = formatAmountForOutput(remainder, {
      showSign: remainder < 0,
    });

    this.#totalRow.style.visibility =
      remainder === 0 || expenseAmount < MIN_EXPENSE_AMOUNT
        ? HIDDEN_CLASS
        : VISIBLE_CLASS;

    restyleRemainderRow(remainder, expenseAmount, this.#remainderRow);

    this.#adjustInputWidth(total, expenseAmount);
  };

  #updateEntryUserId = (entryId, userId) => {
    const entry = this.#entries.get(entryId);
    entry.userId = userId;
  };

  #updatePayerSwitchesAfterPayerChange = (addedUserId, removedUserId) => {
    this.#entries.forEach(entry =>
      entry.updateOptionsAfterPayerChange(addedUserId, removedUserId)
    );
  };

  #renderAddPayerButton = (shouldHide = false) => {
    if (shouldHide) {
      this.#addPayerButton.classList.add(HIDDEN_CLASS);
    } else {
      this.#addPayerButton.classList.remove(HIDDEN_CLASS);
    }
  };

  #adjustInputWidth = (total, expenseAmount) => {
    const amountElements = Array.from(this.#entries.values()).map(
      entry => entry.amountInput
    );
    adjustAmountElementsWidth({
      total,
      expenseAmount,
      amountElements,
      widthOptions: this.#amountWidthOptions,
      defaultWidth: this.#amountWidthDefault,
    });
  };

  // Add / Delete Row

  // Create

  #createEntry = data => {
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
    this.#addRowToEntries(rowElement, entryId, userId);
  };

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
    const selectedAttribute = isFirstRow ? '' : ' selected';
    const inputReadonlyAttribute = isFirstRow ? ' readonly' : '';
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
              <option value="${EXPENSE_PAID_BY_OPTION_EMPTY_ID}" disabled${selectedAttribute}>-- выбрать --</option>
              ${payerOptionsHTML}
            </select>
          </td>
          <td class="payer-table-column__amount">
            <input
              class="payer-amount__input input-amount"
              name="expense-payer-amount-input"
              type="text"
              value="${outputAmount}"
              ${inputReadonlyAttribute}
            />
          </td>
        </tr>`;
  };

  // Utility

  #clearEntries = () => {
    // to develop later
  };

  #clearEntry = entryId => {
    const entry = this.#entries.get(entryId);
    entry.reset();
    entry.hide();
    this.#entries.delete(entryId);
  };

  #addRowToEntries = (rowElement, entryId, userId = null) => {
    const payerSwitch = rowElement.querySelector(this.#payerSwitchClass);
    const amountInput = rowElement.querySelector(this.#amountInputClass);
    const avatarElement = rowElement.querySelector(
      this.getSelectors().PAYER_AVATAR
    );
    const payerOptions = this.#parseEntryPayerOptions(rowElement);

    const entry = new PaidByEntryView({
      entryId,
      userId,
      payerSwitch,
      payerOptions,
      amountInput,
      avatarElement,
      rowElement,
    });
    if (userId) entry.userId = userId;
    this.#entries.set(entryId, entry);
    this.#entriesAll.set(entryId, entry);
  };

  #parseEntryPayerOptions = rowElement => {
    const payerOptionElements = rowElement.querySelectorAll('option');
    return new Map(
      Array.from(payerOptionElements).map(optionElement => {
        const id = TypeParser.parseStringToBigInt(optionElement.value);
        return [id, optionElement];
      })
    );
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

  addHandlerCloseButtonClick = handler => {
    this.#btnClose.addEventListener('click', handler);
  };
}

export default new ExpensePaidByView();
