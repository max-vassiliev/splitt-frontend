import {
  getAvatarUrl,
  formatAmountForOutput,
  restyleRemainderRow,
  adjustAmountElementsWidth,
  setAmountCursorPosition,
} from '../../../../util/RenderHelper.js';
import { DEFAULT_AMOUNT, INACTIVE_CLASS } from '../../../../../util/Config.js';

class ExpenseSplittPartsView {
  #container;
  #selectors;
  #table;
  #rows;
  #separator;
  #totalCell;
  #remainderCell;
  #remainderRow;
  #isInitialized;
  #amountWidthOptions;
  #amountWidthDefault;

  constructor() {
    this.#isInitialized = false;
    this.#rows = new Map();
    this.#parseFormElements();
    this.#initAmountWidthOptions();
    this.#initSelectors();
  }

  init = users => {
    this.#loadUsers(users);
    this.#isInitialized = true;
  };

  #initAmountWidthOptions = () => {
    this.#amountWidthDefault = '14 rem';
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

  #initSelectors = () => {
    this.#selectors = {
      ROW: '.splitt-parts__row',
      INPUT: '.splitt-parts-amount-input',
    };
  };

  #parseFormElements = () => {
    this.#container = document.getElementById('splitt-parts-table');
    this.#table = document.querySelector('.splitt-form__parts');
    this.#separator = document.querySelector('.splitt-parts__row-separator');
    this.#totalCell = document.querySelector(
      '.splitt-parts-column__total-amount'
    );
    this.#remainderCell = document.querySelector(
      '.splitt-parts-column__remainder-amount'
    );
    this.#remainderRow = document.querySelector('.splitt-parts__row-remainder');
  };

  #parseUserRows = users => {
    users.forEach(user => {
      const row = this.#table.querySelector(`[data-user-id="${user.id}"]`);
      if (!row) return;
      this.#rows.set(user.id, {
        row,
        amountInput: row.querySelector('.splitt-parts-amount-input'),
      });
    });
  };

  // GETTERS

  get container() {
    return this.#container;
  }

  get isInitialized() {
    return this.#isInitialized;
  }

  getSelectors = () => {
    return this.#selectors;
  };

  // RENDER

  render = data => {
    this.#validateInitialization();
    const { splittAmounts, total, remainder, expenseAmount } = data;
    this.#renderRows(splittAmounts);
    this.#renderTotal(total);
    this.#renderRemainder(remainder, expenseAmount);
    this.#adjustInputWidth(total, expenseAmount);
  };

  // Render: Elements

  focusInput = userId => {
    const { amountInput } = this.#rows.get(userId);
    amountInput.focus();
  };

  renderCursorPosition = (userId, amountIn, cursorPosition) => {
    const { amountInput } = this.#rows.get(userId);
    const amountOut = amountInput.value;
    setAmountCursorPosition({
      amountIn,
      amountOut,
      cursorPosition,
      inputElement: amountInput,
    });
  };

  #renderRows = splittAmounts => {
    splittAmounts.forEach((amount, userId) => {
      const { amountInput, row } = this.#rows.get(userId);
      amountInput.value = formatAmountForOutput(amount);
      this.#toggleRowActiveView(row, amount);
    });
  };

  #renderTotal = total => {
    this.#totalCell.textContent = formatAmountForOutput(total);
  };

  #renderRemainder = (remainder, expenseAmount) => {
    this.#remainderCell.textContent = formatAmountForOutput(remainder, {
      showSign: remainder < 0,
    });
    restyleRemainderRow(remainder, expenseAmount, this.#remainderRow);
  };

  #adjustInputWidth = (total, expenseAmount) => {
    const amountElements = Array.from(this.#rows.values()).map(
      row => row.amountInput
    );
    adjustAmountElementsWidth({
      total,
      expenseAmount,
      amountElements,
      widthOptions: this.#amountWidthOptions,
      defaultWidth: this.#amountWidthDefault,
    });
  };

  #toggleRowActiveView = (row, amount) => {
    if (amount !== DEFAULT_AMOUNT) {
      row.classList.remove(INACTIVE_CLASS);
    } else {
      row.classList.add(INACTIVE_CLASS);
    }
  };

  // LOAD

  #loadUsers = users => {
    const rowsHTML = this.#generateUserRowsHTML(users);
    this.#separator.insertAdjacentHTML('beforebegin', rowsHTML);
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
    const inactiveFlag = amount === 0 ? ` ${INACTIVE_CLASS}` : '';

    return `
        <tr class="splitt-parts__row${inactiveFlag}" data-user-id="${id}">
          <td class="splitt-parts-column__avatar">
            <img
              class="account__avatar"
              src="${avatarUrl}"
              alt="${name}"
            />
          </td>
          <td class="splitt-parts-column__username">${name}</td>
          <td class="splitt-parts-column__amount">
            <input
              class="splitt-amount__input input-amount splitt-parts-amount splitt-parts-amount-input"
              name="splitt-amount-input"
              type="text"
              value="${formattedAmount}"
            />
          </td>
        </tr>
    `;
  };

  // Validation

  #validateInitialization = () => {
    if (!this.#isInitialized) {
      throw new Error('Splitt Parts form has not been initialized.');
    }
  };
}

export default new ExpenseSplittPartsView();
