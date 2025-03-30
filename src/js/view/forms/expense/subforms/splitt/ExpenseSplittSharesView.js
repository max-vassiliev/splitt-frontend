import {
  getAvatarUrl,
  formatAmountForOutput,
  formatPercentForOutput,
  restyleRemainderRow,
  adjustAmountElementsWidth,
  setAmountCursorPosition,
} from '../../../../util/RenderHelper.js';
import {
  DEFAULT_AMOUNT,
  INACTIVE_CLASS,
  HIDDEN_CLASS,
  VISIBLE_CLASS,
  MIN_EXPENSE_AMOUNT,
} from '../../../../../util/Config.js';

class ExpenseSplittSharesView {
  #container;
  #selectors;
  #table;
  #rows;
  #separator;
  #totalRow;
  #totalShareCell;
  #totalAmountCell;
  #remainderRow;
  #remainderShareCell;
  #remainderAmountCell;
  #isInitialized;
  #amountWidthOptions;
  #amountWidthDefault;

  constructor() {
    this.#isInitialized = false;
    this.#rows = new Map();
    this.#initAmountWidthOptions();
    this.#initSelectors();
    this.#parseFormElements();
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
      [4, '8.5rem'],
      [5, '9.5rem'],
      [6, '10rem'],
      [7, '11rem'],
      [8, '12rem'],
      [9, '13rem'],
      [10, '14.5rem'],
      [11, '15rem'],
    ]);
  };

  #initSelectors = () => {
    this.#selectors = {
      ROW: '.splitt-shares__row',
      INPUT: '.splitt-share__input',
    };
  };

  #parseFormElements = () => {
    this.#container = document.getElementById('splitt-shares-table');
    this.#table = document.querySelector('.splitt-form__shares');
    this.#separator = document.querySelector('.splitt-shares__row-separator');
    this.#totalRow = document.querySelector('.splitt-shares__row-total');
    this.#totalShareCell = document.querySelector(
      '.splitt-shares-column__total-share'
    );
    this.#totalAmountCell = document.querySelector(
      '.splitt-shares-column__total-amount-value'
    );
    this.#remainderRow = document.querySelector(
      '.splitt-shares__row-remainder'
    );
    this.#remainderShareCell = document.querySelector(
      '.splitt-shares-column__remainder-share'
    );
    this.#remainderAmountCell = document.querySelector(
      '.splitt-shares-column__remainder-amount'
    );
  };

  #parseUserRows = users => {
    users.forEach(user => {
      const row = this.#table.querySelector(`[data-user-id="${user.id}"]`);
      if (!row) return;
      this.#rows.set(user.id, {
        row,
        shareInput: row.querySelector('.splitt-share__input'),
        amountCell: row.querySelector('.splitt-shares-column__amount'),
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

    const {
      splittShares,
      splittAmounts,
      totalShare,
      totalAmount,
      remainderShare,
      remainderAmount,
      expenseAmount,
    } = data;

    this.#renderRows(splittShares, splittAmounts);
    this.#renderTotal(totalShare, totalAmount, expenseAmount);
    this.#renderRemainder(remainderShare, expenseAmount, remainderAmount);
    this.#adjustAmountColumnWidth(totalAmount, expenseAmount);
  };

  // Render: Elements

  focusInput = userId => {
    const { shareInput } = this.#rows.get(userId);
    shareInput.focus();
  };

  renderCursorPosition = (userId, shareIn, cursorPosition) => {
    const { shareInput } = this.#rows.get(userId);
    const shareOut = shareInput.value;
    setAmountCursorPosition({
      amountIn: shareIn,
      amountOut: shareOut,
      cursorPosition,
      inputElement: shareInput,
    });
  };

  #renderRows = (splittShares, splittAmounts) => {
    splittShares.forEach((share, userId) => {
      const { shareInput, amountCell, row } = this.#rows.get(userId);
      const amount = splittAmounts.get(userId);
      shareInput.value = formatPercentForOutput(share);
      amountCell.textContent = formatAmountForOutput(amount);
      this.#toggleRowActiveView(row, share);
    });
  };

  #renderTotal = (share, amount, expenseAmount) => {
    this.#totalShareCell.textContent = formatPercentForOutput(share);
    this.#totalAmountCell.textContent = formatAmountForOutput(amount);
    this.#totalRow.style.visibility =
      expenseAmount < MIN_EXPENSE_AMOUNT ? HIDDEN_CLASS : VISIBLE_CLASS;
  };

  #renderRemainder = (share, expenseAmount, amount) => {
    this.#remainderShareCell.textContent = formatPercentForOutput(share);
    this.#remainderAmountCell.textContent = formatAmountForOutput(amount);
    restyleRemainderRow(share, expenseAmount, this.#remainderRow);
  };

  #adjustAmountColumnWidth = (totalAmount, expenseAmount) => {
    adjustAmountElementsWidth({
      total: totalAmount,
      expenseAmount,
      amountElements: this.#totalAmountCell,
      widthOptions: this.#amountWidthOptions,
      defaultWidth: this.#amountWidthDefault,
    });
  };

  #toggleRowActiveView = (row, share) => {
    if (share !== DEFAULT_AMOUNT) {
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
    const { id, name, avatar, share, amount } = user;

    const avatarUrl = getAvatarUrl(avatar);
    const formattedAmount = formatAmountForOutput(amount);
    const formattedShare = formatPercentForOutput(share);
    const inactiveFlag = share === 0 ? ` ${INACTIVE_CLASS}` : '';

    return `
        <tr class="splitt-shares__row${inactiveFlag}" data-user-id="${id}">
          <td class="splitt-shares-column__avatar">
            <img
              class="account__avatar"
              src="${avatarUrl}"
              alt="${name}"
            />
          </td>
          <td class="splitt-shares-column__username">${name}</td>
          <td class="splitt-shares-column__share">
            <input
              class="splitt-share__input input-percent splitt-shares-share"
              name="splitt-share"
              type="text"
              value="${formattedShare}"
            />
          </td>
          <td class="splitt-shares-column__amount">${formattedAmount}</td>
        </tr>
    `;
  };

  // Validation

  #validateInitialization = () => {
    if (!this.#isInitialized) {
      throw new Error('Splitt Shares form has not been initialized.');
    }
  };
}

export default new ExpenseSplittSharesView();
