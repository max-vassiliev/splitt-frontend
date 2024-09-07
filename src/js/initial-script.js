'use strict';

import { IMAGES_PATH } from './util/Config.js';
import stateManager from './model/state/StateManager.js';
import modalService from './services/ModalService.js';

export function initializeLegacyScript() {
  document.addEventListener('DOMContentLoaded', function () {
    const ACTIVE_CLASS = 'active'; //                               ☑️ (Config)
    const INACTIVE_CLASS = 'inactive'; //                           ☑️ (Config)
    const HIDDEN_CLASS = 'hidden'; //                               ☑️ (Config)
    const DEFAULT_CLASS = 'default'; //                             ☑️ (Config)
    const DISABLED_ATTRIBUTE = 'disabled'; //                       ☑️ (Config)
    const BELOW_EXPENSE_AMOUNT_CLASS = 'below-expense-amount'; //   ☑️ (Config)
    const ABOVE_EXPENSE_AMOUNT_CLASS = 'above-expense-amount'; //   ☑️ (Config)
    const POSITIVE_CLASS = 'positive'; //                           ☑️ (Config)
    const NEGATIVE_CLASS = 'negative'; //                           ☑️ (Config)

    const CURRENCY_SYMBOL = '₽'; //                                 ☑️ (State)
    const CURRENT_LOCALE = 'ru-RU'; //                              ☑️ (State)

    const MAX_AMOUNT = 10000000000; //                      TODO! move to Config.js
    const DEFAULT_AMOUNT = 0; //                            TODO! move to Config.js
    const ONE_HUNDRED_PERCENT = 100; //                     TODO! move to Config.js
    const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24; //    TODO! move to Config.js

    const DEFAULT_AVATAR = `avatar-empty.png`; //           ☑️ (Config)
    const DEFAULT_EMOJI_EXPENSE = '🗒️'; //                  ☑️ (Config)
    const DEFAULT_EMOJI_REPAYMENT = '✅'; //                ☑️ (Config)

    let currentGroupId = 1; //                    ☑️ (State.group.id)
    let currentUserId = '4'; //                   ☑️ (State)
    let activeAddExpenseHiddenForm = null; //     TODO! move to State
    let activeAddRepaymentHiddenForm = null; //   TODO! move to State
    let activeEmojiField = null; //               TODO! move to State

    let today; //                                 TODO! move
    let todayString; //                           TODO! move
    let minTransactionDate; //                    TODO! move
    let minTransactionDateString; //              TODO! move

    // ☑️ (State)
    const users = new Map([
      [
        '1',
        {
          name: 'Пётр',
          avatar: 'avatar-peter.png',
        },
      ],
      [
        '2',
        {
          name: 'Катерина',
          avatar: 'avatar-kate.png',
        },
      ],
      [
        '3',
        {
          name: 'Константин Константинопольский',
          avatar: 'avatar-paul.png',
        },
      ],
      [
        '4',
        {
          name: 'Арсений Тарковский',
          avatar: 'avatar-sanya.png',
        },
      ],
    ]);

    let addExpenseFormModel = {
      title: '',
      amount: 0,
      paidBy: {},
      date: null,
      splitt: {},
      isValid: false,
      isPaidByValid: true,
      isSplittValid: true,
      comment: null,
      emojiRow: null,
      balanceOptions: [POSITIVE_CLASS, NEGATIVE_CLASS, HIDDEN_CLASS],
      splittBtnOptions: new Map([
        ['equally', 'поровну'],
        ['parts', 'частями'],
        ['shares', 'долями'],
      ]),
    };

    let payerTableModel = {
      rows: new Map(), // [ rowId, { userId, amount, amountElement, payerSwitch } ]
      total: {}, // { amount, element }
      remainder: {}, // { amount, element }
      amountWidthOptions: new Map([
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
      ]),
    };

    let splittEquallyModel = {
      splittType: 'equally',
      element: null,
      splittAmounts: new Map(),
      splittFields: new Map(),
      checkedRows: new Set(),
    };

    let splittPartsModel = {
      splittType: 'parts',
      element: null,
      splittAmounts: new Map(),
      total: 0,
      remainder: 0,
      splittFields: new Map(),
      totalField: null,
      remainderField: null,
      amountWidthOptions: new Map([
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
      ]),
    };

    let splittSharesModel = {
      splittType: 'shares',
      element: null,
      splittShares: new Map(),
      splittAmounts: new Map(),
      totalShare: 0,
      totalAmount: 0,
      remainderShare: 0,
      remainderAmount: 0,
      splittSharesFields: new Map(),
      splittAmountsFields: new Map(),
      totalShareField: null,
      totalAmountField: null,
      remainderShareField: null,
      remainderAmountField: null,
      amountWidthOptions: new Map([
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
      ]),
    };

    let addRepaymentFormModel = {
      amount: 0,
      date: null,
      userFrom: currentUserId,
      userTo: null,
      emojiRow: null,
      optionsFrom: new Map(),
      optionsTo: new Map(),
      note: null,
      isValid: false,
    };

    const statusClickHandlers = new Map([
      ['positive', handleStatusPositiveClick],
      ['negative', handleStatusNegativeClick],
    ]);

    function isActive(element) {
      return element.classList.contains(ACTIVE_CLASS);
    }

    function activate(element) {
      element.classList.add(ACTIVE_CLASS);
    }

    function deactivate(element) {
      element.classList.remove(ACTIVE_CLASS);
    }

    function hideElement(element) {
      element.classList.add(HIDDEN_CLASS);
    }

    function unhideElement(element) {
      element.classList.remove(HIDDEN_CLASS);
    }

    function isEmptyString(str) {
      return str.trim() === '';
    }

    function clearText(textElement) {
      textElement.value = '';
    }

    function removeWhiteSpace(textElement) {
      if (!isEmptyString(textElement.value)) return;
      clearText(textElement);
    }

    // --------------
    // Elements (e:)
    // --------------

    // e: Utils

    const btnClosePopup = document.querySelectorAll('.btn__close_popup');

    // e: Emoji Picker
    const emojiPickerContainer = document.querySelector(
      '.emoji-picker-container'
    );
    const emojiPickerOptions = {
      onEmojiSelect: handleEmojiSelect,
      searchPosition: 'static',
      previewPosition: 'none',
      locale: 'ru',
    };
    const emojiPicker = new EmojiMart.Picker(emojiPickerOptions);
    document.getElementById('emoji-picker')?.appendChild(emojiPicker);

    // e: Group
    const groupHeader = document.querySelector('.group__info');
    const groupSettingsLink = document.querySelector('.link__group--settings');
    const groupPopup = document.querySelector('.group__popup');
    const groupSwitch = document.querySelector('.group__switch');
    const groupSwitchBtn = document.querySelector('.group__switch_btn');

    // e: Add Expense: Main Form
    const addExpenseBtn = document.querySelector('.add-expense__btn');
    const addExpenseForm = document.querySelector('.add-expense__form');
    const addExpenseMainForm = document.querySelector(
      '.add-expense__form_main'
    );
    const addExpenseBtnEdit = document.querySelectorAll(
      '.add-expense__btn-edit'
    );
    const addExpenseTitleInput = document.querySelector('.add-expense-title');
    const addExpenseAmountInput = document.querySelector('.add-expense-amount');
    const addExpenseDateInput = document.querySelector('.add-expense-date');
    const addExpenseEmojiRow = document.querySelector('.add-expense-emoji-row');
    const addExpenseEmojiContainer = document.querySelector(
      '.add-expense-emoji-container'
    );
    const addExpenseEmojiDefault = document.querySelector(
      '.add-expense-emoji-default'
    );
    const addExpenseEmojiInputField = document.querySelector(
      '.emoji-input.add-expense'
    );
    const addExpenseEmojiPickerSwitchBtn = document.querySelector(
      '.btn__emoji-picker--switch.add-expense'
    );
    const addExpenseEmojiDefaultBtn = document.querySelector(
      '.btn__emoji-restore-default.add-expense'
    );
    const addExpenseEmojiRemoveBtn = document.querySelector(
      '.btn__emoji-remove.add-expense'
    );
    const addExpensePaidByButton = document.querySelector('.btn__paid-by');
    const addExpenseSplittButton = document.querySelector(
      '.btn__open-splitt-form'
    );
    const addExpenseSplittBalanceNoteLabel = document.querySelector(
      '.splitt-balance-note__label'
    );
    const addExpenseSplittBalanceNoteAmount = document.querySelector(
      '.splitt-balance-note__amount'
    );
    const addExpenseHiddenFormBtnClose = document.querySelectorAll(
      '.add-expense__form_btn-close'
    );
    const addExpenseSubmitButton = document.querySelector(
      '.add-expense__btn--submit'
    );
    addExpenseFormModel.emojiRow = addExpenseEmojiRow;

    // e: Add Expense: Hidden Forms
    const addExpenseHiddenForms = document.querySelectorAll(
      '.add-expense__form-hidden'
    );

    // e: Add Expense: Payer Form
    const payerTable = document.querySelector('.payer-table');
    const payerSwitches = document.querySelectorAll('.payer__switch');
    const payerTableRows = document.querySelectorAll('.payer-table-row');
    const payerAvatarColumns = document.querySelectorAll(
      '.payer-table-column__avatar'
    );
    const addPayerRow = document.querySelector('.payer-table-row__add-payer');
    const addPayerButton = document.querySelector('.add-payer-button');
    const payerTotalElement = document.querySelector(
      '.payer-table-column__total-amount'
    );
    const payerTotalRow = document.querySelector('.payer-table-row__total');
    const payerRemainderElement = document.querySelector(
      '.payer-table-column__remainder-amount'
    );
    const payerRemainderRow = document.querySelector(
      '.payer-table-row__remainder'
    );

    payerTableModel.total = { amount: 0, element: payerTotalElement };
    payerTableModel.remainder = { amount: 0, element: payerRemainderElement };

    // e: Add Expense: Splitt Form
    const splittOptionButtons = document.querySelectorAll(
      '.splitt-form__toggle input[type="radio"]'
    );

    const splittFormContainer = document.querySelector(
      '.splitt-form-container'
    );

    const splittSubmitBtn = document.querySelector(
      '.add-expense__form_splitt__btn--submit'
    );

    // e: Add Expense: Splitt Form - Equally
    const splittEquallyTable = document.getElementById('splitt-equally-table');
    const splittEquallyTableRows = document.querySelectorAll(
      '.splitt-equally__row'
    );
    const splittEquallyCheckboxes = document.querySelectorAll(
      '.splitt-equally-checkbox'
    );

    splittEquallyTableRows.forEach(row => {
      const userId = row.dataset.userId;
      const splittField = row.querySelector('.splitt-equally-column__amount');
      splittEquallyModel.splittAmounts.set(userId, DEFAULT_AMOUNT);
      splittEquallyModel.splittFields.set(userId, splittField);
      splittEquallyModel.checkedRows.add(userId);
    });

    activate(splittEquallyTable);
    splittEquallyModel.element = splittEquallyTable;
    addExpenseFormModel.splitt = splittEquallyModel;

    // e: Add Expense: Splitt Form - Parts
    const splittPartsTable = document.getElementById('splitt-parts-table');
    const splittPartsRows = document.querySelectorAll('.splitt-parts__row');
    const splittPartsTotalField = document.querySelector(
      '.splitt-parts-column__total-amount'
    );
    const splittPartsRemainderField = document.querySelector(
      '.splitt-parts-column__remainder-amount'
    );
    const splittPartsRemainderRow = document.querySelector(
      '.splitt-parts__row-remainder'
    );
    const splittPartsAmountInputs = document.querySelectorAll(
      '.splitt-parts-amount-input'
    );
    const splittPartsRowsArray = [...splittPartsRows];
    splittPartsRowsArray.forEach(row => {
      const userId = row.dataset.userId;
      const amountField = row.querySelector('.splitt-parts-amount-input');
      splittPartsModel.splittAmounts.set(userId, 0);
      splittPartsModel.splittFields.set(userId, amountField);
    });
    splittPartsModel.totalField = splittPartsTotalField;
    splittPartsModel.remainderField = splittPartsRemainderField;
    splittPartsModel.element = splittPartsTable;

    // e: Add Expense: Splitt Form - Shares
    const splittSharesTable = document.getElementById('splitt-shares-table');
    const splittSharesRows = document.querySelectorAll('.splitt-shares__row');
    const splittSharesTotalShareField = document.querySelector(
      '.splitt-shares-column__total-share'
    );
    const splittSharesTotalAmountField = document.querySelector(
      '.splitt-shares-column__total-amount-value'
    );
    const splittSharesRemainderRow = document.querySelector(
      '.splitt-shares__row-remainder'
    );
    const splittSharesRemainderShareField = document.querySelector(
      '.splitt-shares-column__remainder-share'
    );
    const splittSharesRemainderAmountField = document.querySelector(
      '.splitt-shares-column__remainder-amount'
    );
    const splittSharesInputs = document.querySelectorAll(
      '.splitt-share__input'
    );
    const splittSharesRowsArray = [...splittSharesRows];
    splittSharesRowsArray.forEach(row => {
      const userId = row.dataset.userId;
      const amountField = row.querySelector('.splitt-shares-column__amount');
      const shareField = row.querySelector('.splitt-share__input');
      splittSharesModel.splittShares.set(userId, DEFAULT_AMOUNT);
      splittSharesModel.splittAmounts.set(userId, DEFAULT_AMOUNT);

      splittSharesModel.splittSharesFields.set(userId, shareField);
      splittSharesModel.splittAmountsFields.set(userId, amountField);
    });
    splittSharesModel.totalShareField = splittSharesTotalShareField;
    splittSharesModel.totalAmountField = splittSharesTotalAmountField;
    splittSharesModel.remainderShareField = splittSharesRemainderShareField;
    splittSharesModel.remainderAmountField = splittSharesRemainderAmountField;
    splittSharesModel.element = splittSharesTable;

    // e: Add Expense: Note Form
    const addExpenseNoteInput = document.querySelector(
      '.add-transaction__form_input-note#expense-note'
    );
    const addExpenseNoteCounter = document.querySelector(
      '.character-count.expense-note'
    );

    const addExpenseNoteForm = {
      noteInput: addExpenseNoteInput,
      counter: addExpenseNoteCounter,
      isExpense: true,
    };

    // e: Add Repayment: Main Form
    const addRepaymentBtn = document.querySelector('.add-repayment__btn');
    const addRepaymentForm = document.querySelector('.add-repayment__form');
    const addRepaymentMainForm = document.querySelector(
      '.add-repayment__form_main'
    );
    const addRepaymentBtnEdit = document.querySelectorAll(
      '.add-repayment__btn-edit'
    );
    const addRepaymentAmountInput = document.querySelector(
      '.add-repayment-amount'
    );
    const addRepaymentDateInput = document.querySelector('.add-repayment-date');
    const addRepaymentSwitchFrom = document.getElementById(
      'add-repayment__switch-from'
    );
    const addRepaymentSwitchTo = document.getElementById(
      'add-repayment__switch-to'
    );
    const addRepaymentEmojiRow = document.querySelector(
      '.add-repayment-emoji-row'
    );
    const addRepaymentEmojiContainer = document.querySelector(
      '.add-repayment-emoji-container'
    );
    const addRepaymentEmojiDefault = document.querySelector(
      '.add-repayment-emoji-default'
    );
    const addRepaymentEmojiInputField = document.querySelector(
      '.emoji-input.add-repayment'
    );
    const addRepaymentEmojiPickerSwitchBtn = document.querySelector(
      '.btn__emoji-picker--switch.add-repayment'
    );
    const addRepaymentEmojiDefaultBtn = document.querySelector(
      '.btn__emoji-restore-default.add-repayment'
    );
    const addRepaymentEmojiRemoveBtn = document.querySelector(
      '.btn__emoji-remove.add-repayment'
    );
    const addRepaymentSubmitButton = document.querySelector(
      '.add-repayment__btn--submit'
    );
    addRepaymentFormModel.emojiRow = addRepaymentEmojiRow;

    // e: Add Repayment: Hidden Forms

    const addRepaymentHiddenForms = document.querySelectorAll(
      '.add-repayment__form-hidden'
    );

    // e: Add Repayment: Note Form
    const addRepaymentNoteInput = document.querySelector(
      '.add-transaction__form_input-note#repayment-note'
    );
    const addRepaymentNoteCounter = document.querySelector(
      '.character-count.repayment-note'
    );
    const addRepaymentHiddenFormBtnClose = document.querySelectorAll(
      '.add-repayment__form_btn-close'
    );

    const addRepaymentNoteForm = {
      noteInput: addRepaymentNoteInput,
      counter: addRepaymentNoteCounter,
      isExpense: false,
    };

    // e: Delete Transactions

    const deleteExpenseModal = document.querySelector('.delete-expense__modal');
    const deleteExpenseBtnClose = document.getElementById(
      'delete-expense-btn-close'
    );
    const deleteExpenseBtnSubmit = document.getElementById(
      'delete-expense-btn-submit'
    );

    const deleteRepaymentModal = document.querySelector(
      '.delete-repayment__modal'
    );
    const deleteRepaymentBtnClose = document.getElementById(
      'delete-repayment-btn-close'
    );
    const deleteRepaymentBtnSubmit = document.getElementById(
      'delete-repayment-btn-submit'
    );

    // e: Transactions (Movements)

    const transactionsTable = document.querySelector('.transactions');

    // e: Status

    const statusContainer = document.querySelector('.status-container');

    // e: Error

    const errorModal = document.querySelector('.error-modal');
    const errorOverlay = document.querySelector('.overlay-error');
    const errorModalBtnClose = document.querySelector(
      '.error-modal__btn-close'
    );

    // ---------------
    // Functions (f:)
    // ---------------

    // f: Util

    function addErrorOverlay() {
      errorOverlay.classList.remove('hidden');
    }

    function hideErrorOverlay() {
      errorOverlay.classList.add('hidden');
    }

    function closeActiveModal() {
      modalService.closeActiveModal();
    }

    function parseInputAmount(value) {
      const cleanedValue = value.replace(/\D/g, '');
      return cleanedValue ? parseInt(cleanedValue) : 0;
    }

    function verifyInputAmount(amount) {
      return amount > MAX_AMOUNT ? Math.floor(amount / 10) : amount;
    }

    function processInputAmount(value) {
      const parsedAmount = parseInputAmount(value);
      return verifyInputAmount(parsedAmount);
    }

    function setAmountCursorPosition(
      amountIn,
      amountOut,
      cursorPosition,
      context
    ) {
      const lengthDifference = amountOut.length - amountIn.length;
      let newCursorPosition = cursorPosition + lengthDifference;
      newCursorPosition = Math.max(
        0,
        Math.min(context.value.length, newCursorPosition)
      );
      context.setSelectionRange(newCursorPosition, newCursorPosition);
    }

    function parsePercentInputString(percentString) {
      let percent;
      let cleanedValue = percentString.replace(/\D/g, '');

      if (cleanedValue === '' || isNaN(cleanedValue)) {
        percent = 0;
      } else {
        let finalPercent;
        let cleanedValueParsed = parseInt(cleanedValue);
        cleanedValueParsed > ONE_HUNDRED_PERCENT
          ? (finalPercent = Math.floor(cleanedValueParsed / 10))
          : (finalPercent = cleanedValueParsed);

        percent = Math.max(finalPercent, 0);
      }

      return percent;
    }

    function formatAmountForOutput(amount) {
      let formattedAmount = (amount / 100).toLocaleString(CURRENT_LOCALE, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      return `${formattedAmount}\u00A0${CURRENCY_SYMBOL}`;
    }

    function formatPercentForOutput(value) {
      return `${value}\u202F%`;
    }

    // f: Window

    function handleWindowResize() {
      alignAddTransactionForms();
    }

    // f: Group

    function openGroupPopup() {
      modalService.openModal(groupPopup);
    }

    function handleGroupSwitchChange() {
      if (this.value === null || this.value === undefined) return;

      const selectedGroupId = parseInt(this.value, 10);

      selectedGroupId === currentGroupId
        ? deactivateGroupSwitchBtn()
        : activateGroupSwitchBtn();
    }

    function deactivateGroupSwitchBtn() {
      if (!groupSwitchBtn.classList.contains(ACTIVE_CLASS)) return;
      groupSwitchBtn.classList.remove(ACTIVE_CLASS);
      groupSwitchBtn.setAttribute(DISABLED_ATTRIBUTE, DISABLED_ATTRIBUTE);
    }

    function activateGroupSwitchBtn() {
      groupSwitchBtn.classList.add(ACTIVE_CLASS);
      groupSwitchBtn.removeAttribute(DISABLED_ATTRIBUTE);
    }

    // f: Emoji Picker

    const emojiField = {
      constructor: function (
        emojiContainer,
        emojiInputField,
        emojiDefaultField,
        emojiDefaultBtn,
        emojiPickerSwitchBtn,
        emojiRemoveBtn
      ) {
        this.emojiContainer = emojiContainer;
        this.emojiInputField = emojiInputField;
        this.emojiDefaultField = emojiDefaultField;
        this.emojiDefaultBtn = emojiDefaultBtn;
        this.emojiPickerSwitchBtn = emojiPickerSwitchBtn;
        this.emojiRemoveBtn = emojiRemoveBtn;
      },
    };

    const addExpenseEmojiField = Object.create(emojiField);
    const addRepaymentEmojiField = Object.create(emojiField);

    addExpenseEmojiField.constructor(
      addExpenseEmojiContainer,
      addExpenseEmojiInputField,
      addExpenseEmojiDefault,
      addExpenseEmojiDefaultBtn,
      addExpenseEmojiPickerSwitchBtn,
      addExpenseEmojiRemoveBtn
    );

    addRepaymentEmojiField.constructor(
      addRepaymentEmojiContainer,
      addRepaymentEmojiInputField,
      addRepaymentEmojiDefault,
      addRepaymentEmojiDefaultBtn,
      addRepaymentEmojiPickerSwitchBtn,
      addRepaymentEmojiRemoveBtn
    );

    function openEmojiInput() {
      if (isActive(activeEmojiField.emojiInputField)) {
        return;
      }
      if (
        !activeEmojiField.emojiDefaultField.classList.contains(HIDDEN_CLASS)
      ) {
        activeEmojiField.emojiDefaultField.classList.add(HIDDEN_CLASS);
      }
      if (activeEmojiField.emojiContainer.classList.contains(DEFAULT_CLASS)) {
        activeEmojiField.emojiContainer.classList.remove(DEFAULT_CLASS);
      }
      activeEmojiField.emojiPickerSwitchBtn.classList.add(HIDDEN_CLASS);
      activeEmojiField.emojiDefaultBtn.classList.add(HIDDEN_CLASS);
      activeEmojiField.emojiInputField.classList.add(ACTIVE_CLASS);
      activeEmojiField.emojiRemoveBtn.classList.add(ACTIVE_CLASS);
    }

    function restoreDefaultEmoji() {
      activeEmojiField.emojiDefaultField.classList.remove(HIDDEN_CLASS);
      activeEmojiField.emojiDefaultBtn.classList.add(HIDDEN_CLASS);
      activeEmojiField.emojiPickerSwitchBtn.classList.add(HIDDEN_CLASS);
      activeEmojiField.emojiRemoveBtn.classList.add(ACTIVE_CLASS);
      activeEmojiField.emojiContainer.classList.add(DEFAULT_CLASS);
    }

    function removeEmoji() {
      if (activeEmojiField.emojiContainer.classList.contains(DEFAULT_CLASS)) {
        activeEmojiField.emojiDefaultField.classList.add(HIDDEN_CLASS);
        activeEmojiField.emojiContainer.classList.remove(DEFAULT_CLASS);
      } else {
        activeEmojiField.emojiInputField.value = '';
        activeEmojiField.emojiInputField.classList.remove(ACTIVE_CLASS);
      }
      activeEmojiField.emojiRemoveBtn.classList.remove(ACTIVE_CLASS);
      activeEmojiField.emojiPickerSwitchBtn.classList.remove(HIDDEN_CLASS);
      activeEmojiField.emojiDefaultBtn.classList.remove(HIDDEN_CLASS);
      activeEmojiField = null;
    }

    function openEmojiPicker() {
      if (isActive(emojiPickerContainer)) return;
      emojiPickerContainer.classList.add(ACTIVE_CLASS);
      document.addEventListener('click', clickOutsideEmojiPicker);
    }

    function closeEmojiPicker() {
      if (!isActive(emojiPickerContainer)) return;
      emojiPickerContainer.classList.remove(ACTIVE_CLASS);
      document.removeEventListener('click', clickOutsideEmojiPicker);
    }

    function toggleEmojiPicker(event) {
      !isActive(emojiPickerContainer) ? openEmojiPicker() : closeEmojiPicker();
      event.stopPropagation();
    }

    function clickOutsideEmojiPicker(event) {
      if (emojiPickerContainer.contains(event.target)) return;
      closeEmojiPicker();
    }

    function handleEmojiSelect(emoji) {
      openEmojiInput();
      activeEmojiField.emojiInputField.value = emoji.native;
      closeEmojiPicker();
    }

    // f: Add Transaction

    function alignAddTransactionForms() {
      const isAddExpenseActive =
        addExpenseForm.classList.contains(ACTIVE_CLASS);
      const isAddRepaymentActive =
        addRepaymentForm.classList.contains(ACTIVE_CLASS);

      if (!isAddExpenseActive) {
        addExpenseForm.classList.add(ACTIVE_CLASS);
      }

      if (!isAddRepaymentActive) {
        addRepaymentForm.classList.add(ACTIVE_CLASS);
      }

      alignTransactionForms(
        addExpenseMainForm,
        addExpenseHiddenForms,
        addExpenseFormModel
      );

      alignTransactionForms(
        addRepaymentMainForm,
        addRepaymentHiddenForms,
        addRepaymentFormModel
      );

      if (!isAddExpenseActive) {
        addExpenseForm.classList.remove(ACTIVE_CLASS);
      }

      if (!isAddRepaymentActive) {
        addRepaymentForm.classList.remove(ACTIVE_CLASS);
      }
    }

    function countNoteLength(counter, inputText) {
      counter.textContent = inputText.length;
    }

    function changeMainFormNoteButtonText(noteForm) {
      const targetNoteForm = noteForm.isExpense
        ? activeAddExpenseHiddenForm
        : activeAddRepaymentHiddenForm;

      targetNoteForm.button.textContent = !isEmptyString(
        noteForm.noteInput.value
      )
        ? 'редактировать'
        : 'написать';
    }

    function closeHiddenForm(isExpense) {
      isExpense ? closeAddExpenseHiddenForm() : closeAddRepaymentHiddenForm();
    }

    function handleTransactionNoteInput(noteForm) {
      removeWhiteSpace(noteForm.noteInput);
      countNoteLength(noteForm.counter, noteForm.noteInput.value);
      changeMainFormNoteButtonText(noteForm);
    }

    function updateTransactionDateInputs() {
      updateAddExpenseDateInput();
      updateAddRepaymentDateInput();
    }

    // f: Add Expense

    function openAddExpense() {
      modalService.openModal(addExpenseForm);
    }

    function toggleAddExpenseHiddenForm(form, button) {
      button.classList.contains(ACTIVE_CLASS)
        ? closeAddExpenseHiddenForm()
        : openAddExpenseHiddenForm(form, button);
    }

    function openAddExpenseHiddenForm(form, button) {
      if (activeAddExpenseHiddenForm) {
        closeAddExpenseHiddenForm();
      }

      form.classList.add(ACTIVE_CLASS);
      button.classList.add(ACTIVE_CLASS);

      activeAddExpenseHiddenForm = { form, button };
    }

    function handleAddExpenseTitleInput(event) {
      removeWhiteSpace(event.target);
      addExpenseFormModel.title = event.target.value;
      updateAddExpenseSubmitButton();
    }

    function handleAddExpenseAmountInput(event) {
      const cursorPosition = this.selectionStart;
      const inputAmount = event.target.value;
      const processedAmount = processInputAmount(inputAmount);
      saveAddExpenseAmount(processedAmount);
      const outputAmount = formatAmountForOutput(processedAmount);
      this.value = outputAmount;
      setAmountCursorPosition(inputAmount, outputAmount, cursorPosition, this);
      updateAddExpenseSubmitButton();
    }

    function handleAddExpenseDateInput(event) {
      if (event.target.value === '') {
        event.target.value = todayString;
      }
      const inputDate = new Date(event.target.value);
      const rightNow = new Date();

      if (inputDate > rightNow) {
        event.target.value = todayString;
      }
    }

    function updateAddExpenseSubmitButton() {
      validateAddExpenseForm();
      renderAddExpenseSubmitButton();
    }

    function validateAddExpenseForm() {
      const isValid =
        !isEmptyString(addExpenseFormModel.title) &&
        addExpenseFormModel.amount > 0 &&
        addExpenseFormModel.isPaidByValid &&
        addExpenseFormModel.isSplittValid;

      addExpenseFormModel.isValid = isValid;
    }

    function renderAddExpenseSubmitButton() {
      if (addExpenseFormModel.isValid) {
        addExpenseSubmitButton.removeAttribute(DISABLED_ATTRIBUTE);
        addExpenseSubmitButton.classList.add(ACTIVE_CLASS);
      } else {
        addExpenseSubmitButton.setAttribute(
          DISABLED_ATTRIBUTE,
          DISABLED_ATTRIBUTE
        );
        addExpenseSubmitButton.classList.remove(ACTIVE_CLASS);
      }
    }

    function saveAddExpenseAmount(amount) {
      addExpenseFormModel.amount = amount;
      updatePaidByOnExpenseChange();
      updateSplitts();
    }

    function updateAddExpenseDateInput() {
      if (!addExpenseDateInput) return;
      addExpenseDateInput.setAttribute('max', todayString);
      addExpenseDateInput.setAttribute('min', minTransactionDateString);
      if (
        addExpenseFormModel.date === null ||
        addExpenseFormModel.date === ''
      ) {
        addExpenseDateInput.value = todayString;
      }
    }

    function closeAddExpenseHiddenForm() {
      activeAddExpenseHiddenForm.form.classList.remove(ACTIVE_CLASS);
      activeAddExpenseHiddenForm.button.classList.remove(ACTIVE_CLASS);
      activeAddExpenseHiddenForm = null;
    }

    // f: Add Expense: Payer Form

    function handleRemovePayerButtonClick() {
      const row = this.closest('.payer-table-row');
      const rowId = parseInt(row.dataset.rowId, 10);
      const payerId = row.dataset.userId;

      if (payerTableModel.rows.size === users.size) {
        unhideElement(addPayerButton);
      }

      updatePayerSwitchesOnRowRemove(rowId, payerId);
      payerTableModel.rows.delete(rowId);
      row.remove();

      calculatePaidBy();
      updateSplittBalanceNote();
      updateAddExpenseSubmitButton();
    }

    function handlePayerAvatarClick() {
      const row = this.closest('.payer-table-row');
      const amountInput = row.querySelector('.payer-amount__input');
      amountInput.focus();
    }

    function handlePayerSwitch(event) {
      const row = this.closest('.payer-table-row');
      const rowId = parseInt(row.dataset.rowId, 10);
      const previousPayerId = row.dataset.userId;
      const newPayerId = event.target.value;

      updatePayerRowOnSelect(row, rowId, newPayerId);
      updatePayerSwitchesOnSelect(rowId, previousPayerId, newPayerId);
      calculatePaidBy();
      updateSplittBalanceNote();
      updateAddExpenseSubmitButton();
    }

    function handlePayerAmountInput(event) {
      const cursorPosition = this.selectionStart;
      const inputAmount = event.target.value;
      const row = this.closest('.payer-table-row');
      const rowId = parseInt(row.dataset.rowId, 10);
      const payerData = payerTableModel.rows.get(rowId);

      const processedAmount = processInputAmount(inputAmount);
      payerData.amount = processedAmount;
      calculatePaidBy();
      updateSplittBalanceNote();
      updateAddExpenseSubmitButton();

      const outputAmount = formatAmountForOutput(payerData.amount);
      this.value = outputAmount;
      setAmountCursorPosition(inputAmount, outputAmount, cursorPosition, this);
    }

    function handleAddPayerClick() {
      if (payerTableModel.rows.size === users.size) return;

      const rowId = generateNewPayerRowId();
      const payerOptionsHTML = generatePayerOptionsHTML();
      const newPayerRowHTML = generateNewPayerRowHTML(rowId, payerOptionsHTML);

      addPayerRow.insertAdjacentHTML('beforebegin', newPayerRowHTML);

      const newPayerRow = addPayerRow.previousElementSibling;
      addEventListenersToPayerRow(newPayerRow);
      addPayerRowToModel(newPayerRow);
      adjustPayerAmountInputWidth();

      if (payerTableModel.rows.size === users.size) {
        hideElement(addPayerButton);
      }
    }

    function generateNewPayerRowId() {
      const maxRowId =
        payerTableModel.rows.size > 0
          ? Math.max(...payerTableModel.rows.keys())
          : 0;
      return maxRowId + 1;
    }

    function addEventListenersToPayerRow(row, isFirstRow = false) {
      const removePayerButton = row.querySelector(
        '.payer-table-column__remove-payer'
      );
      const payerAvatarColumn = row.querySelector(
        '.payer-table-column__avatar'
      );
      const payerSwitch = row.querySelector('.payer__switch');
      const payerAmountInput = row.querySelector('.payer-amount__input');

      if (!isFirstRow) {
        removePayerButton.addEventListener(
          'click',
          handleRemovePayerButtonClick
        );
      }
      payerAvatarColumn.addEventListener('click', handlePayerAvatarClick);
      payerSwitch.addEventListener('change', handlePayerSwitch);
      payerAmountInput.addEventListener('input', handlePayerAmountInput);
    }

    function addPayerRowToModel(row) {
      const rowId = parseInt(row.dataset.rowId, 10);
      const userId = row.dataset.userId;
      const payerSwitch = row.querySelector('.payer__switch');
      const amountInput = row.querySelector('.payer-amount__input');
      payerTableModel.rows.set(rowId, {
        userId,
        payerSwitch,
        amountElement: amountInput,
        amount: DEFAULT_AMOUNT,
      });
    }

    function updatePaidByOnExpenseChange() {
      if (payerTableModel.rows.size !== 1) {
        calculatePaidBy();
        return;
      }

      const paidByRow = payerTableModel.rows.values().next().value;
      paidByRow.amount = addExpenseFormModel.amount;
      paidByRow.amountElement.value = formatAmountForOutput(
        addExpenseFormModel.amount
      );
      calculatePaidBy();
    }

    function updatePayerRowOnSelect(rowElement, rowId, newPayerId) {
      const rowData = payerTableModel.rows.get(rowId);
      rowData.userId = newPayerId;
      rowElement.dataset.userId = newPayerId;

      const rowAvatar = rowElement.querySelector('.account__avatar');
      let newPayerAvatarFile = users.get(newPayerId)?.avatar ?? DEFAULT_AVATAR;
      rowAvatar.src = IMAGES_PATH + newPayerAvatarFile;
    }

    function updatePayerSwitchesOnSelect(
      selectedRowId,
      previousPayerId,
      newPayerId
    ) {
      const switchOptionsToUpdate =
        getPayerSwitchOptionsToUpdate(selectedRowId);

      switchOptionsToUpdate.forEach(option => {
        if (previousPayerId && option.value === previousPayerId) {
          option.removeAttribute(DISABLED_ATTRIBUTE);
        }
        if (option.value === newPayerId) {
          option.setAttribute(DISABLED_ATTRIBUTE, DISABLED_ATTRIBUTE);
        }
      });
    }

    function updatePayerSwitchesOnRowRemove(removedRowId, removedPayerId) {
      const payerSwitchOptionsToUpdate =
        getPayerSwitchOptionsToUpdate(removedRowId);

      payerSwitchOptionsToUpdate.forEach(option => {
        option.value === removedPayerId &&
          option.removeAttribute(DISABLED_ATTRIBUTE);
      });
    }

    function getPayerSwitchOptionsToUpdate(rowIdToRemove) {
      const payerSwitchesToUpdate = payerTableModel.rows
        .entries()
        .filter(([rowId]) => rowId !== rowIdToRemove)
        .map(([_, row]) => row.payerSwitch);

      const switchOptionsToUpdate = payerSwitchesToUpdate.flatMap(
        payerSwitch => {
          return Array.from(payerSwitch.querySelectorAll('option'));
        }
      );

      return switchOptionsToUpdate;
    }

    function calculatePaidBy() {
      const payers = new Set();
      const total = payerTableModel.rows.values().reduce((acc, row) => {
        if (row.amount !== 0 && row.userId) {
          payers.add(row.userId);
        }
        return acc + row.amount;
      }, 0);

      payerTableModel.total.amount = total;
      payerTableModel.remainder.amount =
        addExpenseFormModel.amount - payerTableModel.total.amount;

      validatePayerTable();

      payerTableModel.total.element.textContent = formatAmountForOutput(
        payerTableModel.total.amount
      );
      payerTableModel.remainder.element.textContent = formatAmountForOutput(
        payerTableModel.remainder.amount
      );

      payerTotalRow.style.visibility =
        payerTableModel.remainder.amount === 0 ? 'hidden' : 'visible';

      restyleSplittRemainder(
        payerTableModel.remainder.amount,
        payerRemainderRow
      );
      adjustPayerAmountInputWidth();
      updatePaidByButton(payers);
    }

    function validatePayerTable() {
      if (!isPayerTableRemainderZero()) {
        addExpenseFormModel.isPaidByValid = false;
        return;
      }
      if (!isPayerTableWithValidUsers()) {
        addExpenseFormModel.isPaidByValid = false;
        return;
      }
      addExpenseFormModel.isPaidByValid = true;
    }

    function isPayerTableRemainderZero() {
      return payerTableModel.remainder.amount === 0;
    }

    function isPayerTableWithValidUsers() {
      for (const [_, rowData] of payerTableModel.rows) {
        if (!rowData.userId) {
          return false;
        }
      }
      return true;
    }

    function getAmountByPayerId(payerId) {
      const rowEntry = payerTableModel.rows
        .entries()
        .find(([_, row]) => row.userId === payerId);

      return rowEntry ? rowEntry[1].amount : DEFAULT_AMOUNT;
    }

    // f: Add Expense: Splitt Form

    function handleSplittOptionChange() {
      if (addExpenseFormModel.splitt && addExpenseFormModel.splitt.element) {
        deactivate(addExpenseFormModel.splitt.element);
      }
      const selectedButton = this.getAttribute('id');
      const splittOption = selectedButton.replace(/^splitt-(.*)-button$/, '$1');
      loadSplittForm(splittOption);
    }

    function loadSplittForm(splittOption) {
      let selectedSplittForm;

      switch (splittOption) {
        case 'parts':
          selectedSplittForm = splittPartsModel;
          break;
        case 'shares':
          selectedSplittForm = splittSharesModel;
          break;
        default:
          selectedSplittForm = splittEquallyModel;
      }

      addExpenseSplittButton.textContent =
        addExpenseFormModel.splittBtnOptions.has(splittOption)
          ? addExpenseFormModel.splittBtnOptions.get(splittOption)
          : 'редактировать';

      addExpenseFormModel.splitt = selectedSplittForm;
      updateSplitts();
      activate(addExpenseFormModel.splitt.element);
      updateAddExpenseSubmitButton();
    }

    function updateSplitts() {
      switch (addExpenseFormModel.splitt.splittType) {
        case 'parts':
          updateSplittsParts();
          break;
        case 'shares':
          updateSplittsShares();
          break;
        default:
          updateSplittsEqually();
      }
    }

    // f: Add Expense: Splitt Form - Equally

    function handleSplittEquallyCheckboxChange() {
      const row = this.closest('.splitt-equally__row');
      const userId = row.dataset.userId;
      const isChecked = this.checked;

      if (!isChecked) {
        splittEquallyModel.checkedRows.delete(userId);
        splittEquallyModel.splittAmounts.set(userId, DEFAULT_AMOUNT);
        row.classList.add(INACTIVE_CLASS);
      } else {
        splittEquallyModel.checkedRows.add(userId);
        row.classList.remove(INACTIVE_CLASS);
      }

      updateSplittsEqually();
      updateAddExpenseSubmitButton();
    }

    function handleSplittEquallyRowClick(event) {
      if (event.target.classList.contains('splitt-equally-checkbox')) {
        return;
      }

      const userId = this.dataset.userId;
      const checkbox = this.querySelector('.splitt-equally-checkbox');
      const isChecked = checkbox.checked;
      checkbox.checked = !isChecked;

      if (checkbox.checked === false) {
        splittEquallyModel.checkedRows.delete(userId);
        splittEquallyModel.splittAmounts.set(userId, DEFAULT_AMOUNT);
        this.classList.add(INACTIVE_CLASS);
      } else {
        splittEquallyModel.checkedRows.add(userId);
        this.classList.remove(INACTIVE_CLASS);
      }

      updateSplittsEqually();
    }

    function updateSplittsEqually() {
      const checkedRowsCount = splittEquallyModel.checkedRows.size;
      addExpenseFormModel.isSplittValid = checkedRowsCount === 0 ? false : true;

      if (addExpenseFormModel.amount === 0 || checkedRowsCount === 0) {
        setDefaultSplittsEqually();
      } else {
        calculateSplittsEqually(checkedRowsCount);
      }

      renderSplittEqually();
      updateSplittBalanceNote();
      updateAddExpenseSubmitButton();
    }

    function setDefaultSplittsEqually() {
      splittEquallyModel.splittAmounts.forEach((_, userId, splittsMap) => {
        splittsMap.set(userId, DEFAULT_AMOUNT);
      });
    }

    function calculateSplittsEqually(checkedRowsCount) {
      if (checkedRowsCount === 0) return;

      if (checkedRowsCount === 1) {
        const checkedUserId = splittEquallyModel.checkedRows
          .values()
          .next().value;
        splittEquallyModel.splittAmounts.set(
          checkedUserId,
          addExpenseFormModel.amount
        );
        return;
      }

      const baseAmount = Math.floor(
        addExpenseFormModel.amount / checkedRowsCount
      );
      const remainder = addExpenseFormModel.amount % checkedRowsCount;

      const usersWithHigherAmounts = selectUsersWithHigherAmounts(
        splittEquallyModel.checkedRows,
        remainder
      );

      splittEquallyModel.checkedRows.forEach(userId => {
        let splittAmount = baseAmount;
        if (usersWithHigherAmounts.has(userId)) {
          splittAmount += 1;
        }
        splittEquallyModel.splittAmounts.set(userId, splittAmount);
      });
    }

    function renderSplittEqually() {
      splittEquallyModel.splittAmounts.forEach((splittAmount, userId) => {
        const splittField = splittEquallyModel.splittFields.get(userId);
        splittField.textContent = formatAmountForOutput(splittAmount);
      });
    }

    function selectUsersWithHigherAmounts(users, count) {
      if (count === 0) return new Set();
      let usersToSelect = Array.from(users);
      usersToSelect.sort(() => Math.random() - 0.5);
      let selectedUsers = usersToSelect.slice(0, count);
      return new Set(selectedUsers);
    }

    // f: Add Expense: Splitt Form - Parts

    function updateSplittsParts() {
      calculateSplittParts();
      updateSplittBalanceNote();
      updateAddExpenseSubmitButton();
    }

    function loadSplittPartsForm() {
      calculateSplittParts();
    }

    function calculateSplittParts() {
      const total = splittPartsModel.splittAmounts
        .values()
        .reduce((acc, currentValue) => acc + currentValue, 0);

      splittPartsModel.total = total;
      splittPartsModel.remainder =
        addExpenseFormModel.amount - splittPartsModel.total;
      addExpenseFormModel.isSplittValid =
        splittPartsModel.remainder !== 0 ? false : true;

      splittPartsModel.totalField.textContent = formatAmountForOutput(
        splittPartsModel.total
      );
      splittPartsModel.remainderField.textContent = formatAmountForOutput(
        splittPartsModel.remainder
      );

      adjustSplittPartsColumnWidth();
      restyleSplittRemainder(
        splittPartsModel.remainder,
        splittPartsRemainderRow
      );
    }

    function adjustSplittPartsColumnWidth() {
      const referenceAmount =
        addExpenseFormModel.amount > splittPartsModel.total
          ? addExpenseFormModel.amount
          : splittPartsModel.total;

      const expenseAmountLength = referenceAmount.toString().length;
      const adjustedWidth =
        splittPartsModel.amountWidthOptions.get(expenseAmountLength) || '14rem';
      splittPartsModel.splittFields.forEach(field => {
        field.style.width = adjustedWidth;
      });
    }

    function handleSplittPartsAmountInput(event) {
      const cursorPosition = this.selectionStart;
      const inputAmount = event.target.value;
      const row = this.closest('.splitt-parts__row');
      const userId = row.dataset.userId;

      const processedAmount = processInputAmount(inputAmount);
      splittPartsModel.splittAmounts.set(userId, processedAmount);
      applySplittPartsRowActiveStyle(processedAmount, row);
      calculateSplittParts();
      updateSplittBalanceNote();
      updateAddExpenseSubmitButton();

      const outputAmount = formatAmountForOutput(
        splittPartsModel.splittAmounts.get(userId)
      );
      this.value = outputAmount;
      setAmountCursorPosition(inputAmount, outputAmount, cursorPosition, this);
    }

    function handleSplittPartsRowClick(event) {
      const amountInput = event.currentTarget.querySelector(
        '.splitt-parts-amount-input'
      );
      amountInput.focus();
    }

    function applySplittPartsRowActiveStyle(splittAmount, splittRow) {
      if (splittAmount === 0) {
        splittRow.classList.add(INACTIVE_CLASS);
      } else {
        splittRow.classList.remove(INACTIVE_CLASS);
      }
    }

    // f: Add Expense: Splitt Form - Shares

    function loadSplittSharesForm() {
      calculateSplittSharesAmounts();
      calculateSplittShares();
      renderSplittShares();
    }

    function updateSplittsShares() {
      calculateSplittSharesAmounts();
      calculateSplittShares();
      renderSplittShares();
      updateSplittBalanceNote();
    }

    function handleSplittSharesInput(event) {
      const cursorPosition = this.selectionStart;
      const inputValue = event.target.value;
      const row = this.closest('.splitt-shares__row');
      const userId = row.dataset.userId;

      const splittShare = parsePercentInputString(inputValue);

      if (splittShare > 100) {
        const previousValue = splittSharesModel.splittShares.get(userId) || 0;
        applySplittSharesRowActiveStyle(previousValue, row);
        const outputValue = formatPercentForOutput(previousValue);
        this.value = outputValue;
        setAmountCursorPosition(inputValue, outputValue, cursorPosition, this);
        return;
      }

      const splittAmount = calculateSplittShareAmount(
        splittShare,
        addExpenseFormModel.amount
      );

      splittSharesModel.splittShares.set(userId, splittShare);
      splittSharesModel.splittAmounts.set(userId, splittAmount);

      applySplittSharesRowActiveStyle(splittShare, row);
      calculateSplittShares();
      renderSplittShares();
      updateSplittBalanceNote();
      updateAddExpenseSubmitButton();

      const splittShareOut = formatPercentForOutput(splittShare);
      this.value = splittShareOut;

      setAmountCursorPosition(inputValue, splittShareOut, cursorPosition, this);
    }

    function handleSplittSharesRowClick(event) {
      const shareInput = event.currentTarget.querySelector(
        '.splitt-share__input'
      );
      shareInput.focus();
    }

    function calculateSplittShareAmount(splittShare, totalAmount) {
      return Math.round((totalAmount * splittShare) / ONE_HUNDRED_PERCENT);
    }

    function calculateSplittSharesAmounts() {
      splittSharesModel.splittShares.forEach((splittShare, userId) => {
        const splittAmount = calculateSplittShareAmount(
          splittShare,
          addExpenseFormModel.amount
        );
        splittSharesModel.splittAmounts.set(userId, splittAmount);
      });
    }

    function calculateSplittShares() {
      const totalAmount = splittSharesModel.splittAmounts
        .values()
        .reduce((acc, currentValue) => acc + currentValue, 0);

      const totalShare = splittSharesModel.splittShares
        .values()
        .reduce((acc, currentValue) => acc + currentValue, 0);

      splittSharesModel.totalAmount = totalAmount;
      splittSharesModel.totalShare = totalShare;

      splittSharesModel.remainderAmount =
        addExpenseFormModel.amount - splittSharesModel.totalAmount;

      splittSharesModel.remainderShare =
        addExpenseFormModel.amount === 0 ? 0 : ONE_HUNDRED_PERCENT - totalShare;

      addExpenseFormModel.isSplittValid =
        splittSharesModel.remainderAmount !== 0 ? false : true;
    }

    function renderSplittShares() {
      splittSharesModel.splittAmounts.forEach((splittAmount, userId) => {
        const splittAmountField =
          splittSharesModel.splittAmountsFields.get(userId);
        splittAmountField.textContent = formatAmountForOutput(splittAmount);
      });

      splittSharesModel.totalAmountField.textContent = formatAmountForOutput(
        splittSharesModel.totalAmount
      );

      splittSharesModel.remainderAmountField.textContent =
        formatAmountForOutput(splittSharesModel.remainderAmount);

      splittSharesModel.totalShareField.textContent = formatPercentForOutput(
        splittSharesModel.totalShare
      );
      splittSharesModel.remainderShareField.textContent =
        formatPercentForOutput(splittSharesModel.remainderShare);

      restyleSplittRemainder(
        splittSharesModel.remainderShare,
        splittSharesRemainderRow
      );

      adjustSplittSharesColumnWidth();
    }

    function applySplittSharesRowActiveStyle(splittShare, splittRow) {
      if (splittShare === 0) {
        splittRow.classList.add(INACTIVE_CLASS);
      } else {
        splittRow.classList.remove(INACTIVE_CLASS);
      }
    }

    function adjustSplittSharesColumnWidth() {
      const referenceAmount =
        addExpenseFormModel.amount > splittSharesModel.totalAmount
          ? addExpenseFormModel.amount
          : splittSharesModel.totalAmount;

      const expenseAmountLength = referenceAmount.toString().length;
      const adjustedWidth =
        splittSharesModel.amountWidthOptions.get(expenseAmountLength) ||
        '14rem';

      splittSharesModel.totalAmountField.style.width = adjustedWidth;
    }

    function restyleSplittRemainder(remainder, remainderRow) {
      removeAdditionalClasses(remainderRow, [
        ABOVE_EXPENSE_AMOUNT_CLASS,
        BELOW_EXPENSE_AMOUNT_CLASS,
      ]);

      if (remainder === 0) {
        return;
      }
      if (remainder < 0) {
        remainderRow.classList.add(ABOVE_EXPENSE_AMOUNT_CLASS);
      }
      remainderRow.classList.add(BELOW_EXPENSE_AMOUNT_CLASS);
    }

    function removeAdditionalClasses(element, additionalClasses) {
      additionalClasses.forEach(additionalClass => {
        element.classList.remove(additionalClass);
      });
    }

    function updateSplittBalanceNote() {
      removeAdditionalClasses(
        addExpenseSplittBalanceNoteAmount,
        addExpenseFormModel.balanceOptions
      );

      if (addExpenseFormModel.amount === 0) {
        renderSplittBalanceNote(DEFAULT_AMOUNT);
        return;
      }

      if (!addExpenseFormModel.isPaidByValid) {
        addExpenseSplittBalanceNoteLabel.textContent =
          'проверьте форму «Кто платил»';
        addExpenseSplittBalanceNoteAmount.classList.add(HIDDEN_CLASS);
        return;
      }

      if (!addExpenseFormModel.isSplittValid) {
        addExpenseSplittBalanceNoteLabel.textContent =
          'проверьте форму «Поделить»';
        addExpenseSplittBalanceNoteAmount.classList.add(HIDDEN_CLASS);
        return;
      }

      const balance = countSplittBalance();
      renderSplittBalanceNote(balance);
    }

    function countSplittBalance() {
      if (!addExpenseFormModel.splitt) return 0;

      const userSplittAmount =
        addExpenseFormModel.splitt.splittAmounts.get(currentUserId);
      const userExpenseAmount = getAmountByPayerId(currentUserId);

      return userExpenseAmount - userSplittAmount;
    }

    function renderSplittBalanceNote(balance) {
      addExpenseSplittBalanceNoteLabel.textContent = 'ваш баланс:\u00A0';
      let formattedBalance = formatAmountForOutput(balance);
      addExpenseSplittBalanceNoteAmount.textContent = formattedBalance;

      if (balance === 0) {
        return;
      }
      if (balance < 0) {
        addExpenseSplittBalanceNoteAmount.classList.add(NEGATIVE_CLASS);
        return;
      }
      addExpenseSplittBalanceNoteAmount.textContent = `+${formattedBalance}`;
      addExpenseSplittBalanceNoteAmount.classList.add(POSITIVE_CLASS);
    }

    // f: Add Repayment

    function openAddRepayment() {
      modalService.openModal(addRepaymentForm);
    }

    function toggleAddRepaymentHiddenForm(form, button) {
      button.classList.contains(ACTIVE_CLASS)
        ? closeAddRepaymentHiddenForm()
        : openAddRepaymentHiddenForm(form, button);
    }

    function openAddRepaymentHiddenForm(form, button) {
      if (activeAddRepaymentHiddenForm) {
        closeAddRepaymentHiddenForm();
      }

      form.classList.add(ACTIVE_CLASS);
      button.classList.add(ACTIVE_CLASS);

      activeAddRepaymentHiddenForm = { form, button };
    }

    function closeAddRepaymentHiddenForm() {
      activeAddRepaymentHiddenForm.form.classList.remove(ACTIVE_CLASS);
      activeAddRepaymentHiddenForm.button.classList.remove(ACTIVE_CLASS);
      activeAddRepaymentHiddenForm = null;
    }

    function handleAddRepaymentFromChange(event) {
      const selectedUserId = event.target.value;
      const previousUserId = addRepaymentFormModel.userFrom;

      addRepaymentFormModel.userFrom = selectedUserId;

      const optionToDisable =
        addRepaymentFormModel.optionsTo.get(selectedUserId);
      optionToDisable.setAttribute(DISABLED_ATTRIBUTE, DISABLED_ATTRIBUTE);
      if (previousUserId !== null) {
        const optionToActivate =
          addRepaymentFormModel.optionsTo.get(previousUserId);
        optionToActivate.removeAttribute(DISABLED_ATTRIBUTE);
      }
      updateAddRepaymentSubmitButton();
    }

    function handleAddRepaymentToChange(event) {
      const selectedUserId = event.target.value;
      const previousUserId = addRepaymentFormModel.userTo;

      addRepaymentFormModel.userTo = selectedUserId;

      const optionToDisable =
        addRepaymentFormModel.optionsFrom.get(selectedUserId);
      optionToDisable.setAttribute(DISABLED_ATTRIBUTE, DISABLED_ATTRIBUTE);
      if (previousUserId !== null) {
        const optionToActivate =
          addRepaymentFormModel.optionsFrom.get(previousUserId);
        optionToActivate.removeAttribute(DISABLED_ATTRIBUTE);
      }
      updateAddRepaymentSubmitButton();
    }

    function handleAddRepaymentAmountInput(event) {
      const cursorPosition = this.selectionStart;
      const inputAmount = event.target.value;
      const processedAmount = processInputAmount(inputAmount);
      addRepaymentFormModel.amount = processedAmount;
      const outputAmount = formatAmountForOutput(processedAmount);
      this.value = outputAmount;
      setAmountCursorPosition(inputAmount, outputAmount, cursorPosition, this);
      updateAddRepaymentSubmitButton();
    }

    function updateAddRepaymentDateInput() {
      if (!addRepaymentDateInput) return;

      addRepaymentDateInput.setAttribute('max', todayString);
      addRepaymentDateInput.setAttribute('min', minTransactionDateString);

      if (
        addRepaymentFormModel.date === null ||
        addRepaymentFormModel.date === ''
      ) {
        addRepaymentDateInput.value = todayString;
      }
    }

    function updateAddRepaymentSubmitButton() {
      validateAddRepaymentSubmitButton();
      renderAddRepaymentSubmitButton();
    }

    function validateAddRepaymentSubmitButton() {
      const isValid =
        addRepaymentFormModel.amount > 0 &&
        addRepaymentFormModel.userFrom !== null &&
        addRepaymentFormModel.userTo !== null;

      addRepaymentFormModel.isValid = isValid;
    }

    function renderAddRepaymentSubmitButton() {
      if (addRepaymentFormModel.isValid) {
        addRepaymentSubmitButton.removeAttribute(DISABLED_ATTRIBUTE);
        addRepaymentSubmitButton.classList.add(ACTIVE_CLASS);
      } else {
        addRepaymentSubmitButton.setAttribute(
          DISABLED_ATTRIBUTE,
          DISABLED_ATTRIBUTE
        );
        addRepaymentSubmitButton.classList.remove(ACTIVE_CLASS);
      }
    }

    // f: Delete Transactions: Expense

    function openDeleteExpense() {
      modalService.openModal(deleteExpenseModal);
    }

    function handleDeleteExpenseCloseButtonClick() {
      modalService.closeActiveModal();
    }

    function handleDeleteExpenseSubmitButtonClick() {
      console.log('DELETE: Expense');
    }

    // f: Delete Transactions: Repayment

    function openDeleteRepayment() {
      modalService.openModal(deleteRepaymentModal);
    }

    function handleDeleteRepaymentCloseButtonClick() {
      modalService.closeActiveModal();
    }

    function handleDeleteRepaymentSubmitButtonClick() {
      console.log('DELETE: Repayment');
    }

    // f: Transactions (Movements)

    function handleTransactionsTableClick(event) {
      if (event.target.classList.contains('transactions-table__delete-btn')) {
        handleRemoveTransactionClick(event);
        return;
      }
      const transactionRow = event.target.closest('.transactions-table__row');
      if (transactionRow) {
        handleEditTransactionClick(transactionRow, event);
        return;
      }
      const transactionsEmpty = event.target.closest('.transactions__empty');
      if (transactionsEmpty) {
        handleEmptyTransactionsTableClick(event);
        return;
      }
    }

    function handleRemoveTransactionClick(event) {
      const rowToDelete = event.target.closest('.transactions-table__row');
      if (rowToDelete.classList.contains('repayment')) {
        openDeleteRepayment();
      } else {
        openDeleteExpense();
      }
    }

    function handleEditTransactionClick(transactionRow, event) {
      if (!transactionRow) return;

      if (transactionRow.classList.contains('.repayment')) {
        console.log('edit repayment');
      } else {
        console.log('edit expense');
      }
    }

    function handleEmptyTransactionsTableClick(event) {
      if (event.target.classList.contains('add-expense-link')) {
        openAddExpense();
        return;
      }
      if (event.target.classList.contains('add-repayment-link')) {
        openAddRepayment();
        return;
      }
    }

    // f: Status

    function handleStatusContainerClick(event) {
      const statusSection = event.target.closest('.status');
      if (!statusSection) return;

      const statusTypeClass = Array.from(statusSection.classList).find(
        statusClass => statusClass.startsWith('status-')
      );
      if (!statusTypeClass) return;

      const statusType = statusTypeClass.split('-')[1];
      const handleStatusClick = statusClickHandlers.get(statusType);
      if (!handleStatusClick) return;

      handleStatusClick(event);
    }

    function handleStatusPositiveClick(event) {
      const selectedRow = event.target.closest('.summary__table--row');
      if (!selectedRow) return;

      console.log('STATUS: Positive');
    }

    function handleStatusNegativeClick(event) {
      const selectedRow = event.target.closest('.summary__table--row');
      if (!selectedRow) return;

      console.log('STATUS: Negative');
    }

    // f: Error

    function openErrorModal() {
      addErrorOverlay();
      errorModal.classList.add(ACTIVE_CLASS);
    }

    function closeErrorModal() {
      hideErrorOverlay();
      errorModal.classList.remove(ACTIVE_CLASS);
    }

    // ----------------------
    // View (v:)
    // ----------------------

    // v: Add Expense: Payer Form

    function createFirstPayerRow() {
      const rowId = generateNewPayerRowId();
      const payerOptionsHTML = generateFirstRowOptionsHTML();
      const defaultPayerRowHTML = generateNewPayerRowHTML(
        rowId,
        payerOptionsHTML,
        true
      );

      addPayerRow.insertAdjacentHTML('beforebegin', defaultPayerRowHTML);

      const defaultPayerRow = addPayerRow.previousElementSibling;
      addEventListenersToPayerRow(defaultPayerRow, true);
      addPayerRowToModel(defaultPayerRow);

      if (payerTableModel.rows.size === users.size) {
        hideElement(addPayerButton);
      }
    }

    function generateFirstRowOptionsHTML() {
      let payerOptionsHTML = '';

      users.forEach((userData, userId) => {
        const selectedAttribute = userId === currentUserId ? ' selected' : '';
        payerOptionsHTML += `<option value="${userId}"${selectedAttribute}>${userData.name}</option>\n`;
      });

      return payerOptionsHTML;
    }

    function generatePayerOptionsHTML() {
      let payerOptionsHTML = '';

      const payersToDisable = new Set();
      payerTableModel.rows.forEach(row => {
        payersToDisable.add(row.userId);
      });

      users.forEach((userData, userId) => {
        const disabledAttribute = payersToDisable.has(userId)
          ? ' disabled'
          : '';
        payerOptionsHTML += `<option value="${userId}"${disabledAttribute}>${userData.name}</option>\n`;
      });

      return payerOptionsHTML;
    }

    function generateNewPayerRowHTML(
      rowId,
      payerOptionsHTML,
      isFirstRow = false
    ) {
      let avatar = IMAGES_PATH + DEFAULT_AVATAR;
      let dataUserId = '';
      let removeColumnAttribute = '';

      if (isFirstRow) {
        avatarFile = users.get(currentUserId)?.avatar ?? DEFAULT_AVATAR;
        avatar = IMAGES_PATH + avatarFile;
        dataUserId = currentUserId ? ` data-user-id="${currentUserId}"` : '';
        removeColumnAttribute = ' inactive';
      }

      const newPayerRowHTML = `<tr class="payer-table-row" data-row-id="${rowId}"${dataUserId}>
          <td class="payer-table-column__remove-payer${removeColumnAttribute}">
            <div class="remove-payer-button" title="удалить">
              &times;
            </div>
          </td>
          <td class="payer-table-column__avatar">
            <img
              class="account__avatar"
              src="${avatar}"
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
              value="0,00&nbsp;₽"
            />
          </td>
        </tr>`;

      return newPayerRowHTML;
    }

    function updatePaidByButton(payers) {
      if (payers.size === 0) {
        addExpensePaidByButton.textContent = 'пока никто';
        return;
      }
      if (payers.size > 1) {
        addExpensePaidByButton.textContent = 'совместно';
        return;
      }

      const payerId = payers.values().next().value;

      if (payerId === currentUserId) {
        addExpensePaidByButton.textContent = 'вы';
        return;
      }
      const payer = users.get(payerId);
      const payerLabel = payer.name ? payer.name : 'другой пользователь';
      addExpensePaidByButton.textContent = payerLabel;
    }

    function adjustPayerAmountInputWidth() {
      const referenceAmount =
        addExpenseFormModel.amount > payerTableModel.total.amount
          ? addExpenseFormModel.amount
          : payerTableModel.total.amount;

      const referenceAmountLength = referenceAmount.toString().length;
      const adjustedWidth =
        payerTableModel.amountWidthOptions.get(referenceAmountLength) ||
        '14rem';

      const payerAmountInputElements = Array.from(
        payerTableModel.rows.values()
      ).map(row => row.amountElement);

      payerAmountInputElements.forEach(inputElement => {
        inputElement.style.width = adjustedWidth;
      });
    }

    // v: Add Expense: Splitt

    function alignTransactionForms(mainForm, hiddenForms, model) {
      const topMargin = calculateTransactionFormTopMargin(mainForm);
      const mainFormRightMargin = calculateTransactionFormHorizontalMargin();
      const hiddenFormLeftMargin = calculateTransactionHiddenFormLeftMargin();

      mainForm.style.top = topMargin;
      mainForm.style.right = mainFormRightMargin;

      hiddenForms.forEach(hiddenForm => {
        hiddenForm.style.top = topMargin;
        hiddenForm.style.left = hiddenFormLeftMargin;
      });

      adjustTransactionEmojiMenu(model);
    }

    function adjustTransactionEmojiMenu(formModel) {
      const emojiRowRect = formModel.emojiRow.getBoundingClientRect();
      const emojiRowHeight = formModel.emojiRow.offsetHeight;

      const emojiContainerTopMargin = Math.round(
        emojiRowRect.top - emojiRowHeight * 1.8
      );

      emojiPickerContainer.style.top = `${emojiContainerTopMargin}px`;
    }

    function calculateTransactionFormTopMargin(form) {
      const viewportHeight = window.innerHeight;
      let heightRatio =
        calculateTransactionFormTopMarginHeightRatio(viewportHeight);
      const formHeight = form.offsetHeight;
      const topMargin = Math.round((viewportHeight - formHeight) / heightRatio);

      return `${topMargin}px`;
    }

    function calculateTransactionFormHorizontalMargin() {
      const viewportWidth = window.innerWidth;
      const rightMargin = Math.round(viewportWidth * (11 / 20));

      return `${rightMargin}px`;
    }

    function calculateTransactionHiddenFormLeftMargin() {
      const leftMargin = window.innerWidth / 2;
      return `${leftMargin}px`;
    }

    function calculateTransactionFormTopMarginHeightRatio(viewportHeight) {
      if (viewportHeight < 1050) {
        return 2;
      }
      if (viewportHeight < 1500) {
        return 3;
      }
      return 4;
    }

    // v: Add Repayment: Main Form

    function createRepaymentOptions() {
      const { optionsFrom, optionsTo } = generateRepaymentOptionsHTML();
      addRepaymentSwitchFrom.innerHTML = optionsFrom;
      addRepaymentSwitchTo.innerHTML = optionsTo;

      addRepaymentOptionsToModel();
      const optionToDisable =
        addRepaymentFormModel.optionsTo.get(currentUserId);
      optionToDisable.setAttribute(DISABLED_ATTRIBUTE, DISABLED_ATTRIBUTE);
    }

    function addRepaymentOptionsToModel() {
      const optionsFrom = addRepaymentSwitchFrom.options;
      const optionsTo = addRepaymentSwitchTo.options;

      [...optionsFrom].forEach(option => {
        addRepaymentFormModel.optionsFrom.set(option.value, option);
      });

      [...optionsTo].forEach(option => {
        if (option.value === '') return;
        addRepaymentFormModel.optionsTo.set(option.value, option);
      });
    }

    function generateRepaymentOptionsHTML() {
      let optionsFrom = '';
      let optionsTo =
        '<option value="" selected disabled>-- выбрать --</option>\n';

      users.forEach((userData, userId) => {
        let selectedFrom = '';
        let disabledTo = '';
        let userNameFrom = userData.name;
        let userNameTo = userData.name;

        if (userId === currentUserId) {
          selectedFrom = ' selected';
          disabledTo = ' disabled';
          userNameFrom = 'от вас';
          userNameTo = 'вам';
        }

        optionsFrom += `<option value="${userId}"${selectedFrom}>${userNameFrom}</option>\n`;
        optionsTo += `<option value="${userId}"${disabledTo}>${userNameTo}</option>\n`;
      });

      return { optionsFrom, optionsTo };
    }

    // ----------------------
    // Load Content (load:)
    // ----------------------

    // load: Add Expense / Add Repayment: Vertical Align
    alignAddTransactionForms();

    // load: Add Expense / Add Repayment: Set Default Emojis
    addExpenseEmojiDefault.textContent = DEFAULT_EMOJI_EXPENSE;
    addRepaymentEmojiDefault.textContent = DEFAULT_EMOJI_REPAYMENT;

    // load: Add Expense: Payer Form
    createFirstPayerRow();

    // load: Add Repayment: Main Form
    createRepaymentOptions();

    // load: Auxiliary: Date

    function formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    function getMillisecondsUntilNextDay(now) {
      const nextDay = new Date(now);
      nextDay.setDate(nextDay.getDate() + 1);
      nextDay.setHours(0, 0, 10, 0);

      return nextDay - now;
    }

    function resetDate() {
      const now = new Date();
      today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      minTransactionDate = new Date(today);
      minTransactionDate.setFullYear(today.getFullYear() - 5);

      todayString = formatDate(today);
      minTransactionDateString = formatDate(minTransactionDate);

      updateTransactionDateInputs();
      const millisecondsUntilNextDay = getMillisecondsUntilNextDay(now);
      setTimeout(resetDate, millisecondsUntilNextDay);
    }
    resetDate();

    // ----------------------
    // Event Listeners (el:)
    // ----------------------

    // el: Auxiliary

    function toggleHiddenForm(button, transactionType) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        const hiddenFormName = this.dataset.form;
        const hiddenForm = document.querySelector(
          `.add-${transactionType}__form_${hiddenFormName}`
        );
        transactionType === 'expense'
          ? toggleAddExpenseHiddenForm(hiddenForm, this)
          : toggleAddRepaymentHiddenForm(hiddenForm, this);
      });
    }

    // el: Window

    window.addEventListener('resize', handleWindowResize);

    // el: Group

    groupHeader.addEventListener('click', openGroupPopup);

    groupSettingsLink.addEventListener('click', function (event) {
      event.preventDefault();
      closeMenuPopup();
      openGroupPopup();
    });

    groupSwitch.addEventListener('change', handleGroupSwitchChange);

    // el: Emoji Picker

    addExpenseEmojiPickerSwitchBtn.addEventListener('click', function (event) {
      activeEmojiField = addExpenseEmojiField;
      toggleEmojiPicker(event);
    });

    addExpenseEmojiInputField.addEventListener('click', function (event) {
      activeEmojiField = addExpenseEmojiField;
      toggleEmojiPicker(event);
    });

    addExpenseEmojiDefault.addEventListener('click', function (event) {
      activeEmojiField = addExpenseEmojiField;
      toggleEmojiPicker(event);
    });

    addExpenseEmojiDefaultBtn.addEventListener('click', function () {
      activeEmojiField = addExpenseEmojiField;
      restoreDefaultEmoji();
    });

    addExpenseEmojiRemoveBtn.addEventListener('click', function () {
      activeEmojiField = addExpenseEmojiField;
      removeEmoji();
    });

    addRepaymentEmojiPickerSwitchBtn.addEventListener(
      'click',
      function (event) {
        activeEmojiField = addRepaymentEmojiField;
        toggleEmojiPicker(event);
      }
    );

    addRepaymentEmojiInputField.addEventListener('click', function (event) {
      activeEmojiField = addRepaymentEmojiField;
      toggleEmojiPicker(event);
    });

    addRepaymentEmojiDefault.addEventListener('click', function (event) {
      activeEmojiField = addRepaymentEmojiField;
      toggleEmojiPicker(event);
    });

    addRepaymentEmojiDefaultBtn.addEventListener('click', function () {
      activeEmojiField = addRepaymentEmojiField;
      restoreDefaultEmoji();
    });

    addRepaymentEmojiRemoveBtn.addEventListener('click', function () {
      activeEmojiField = addRepaymentEmojiField;
      removeEmoji();
    });

    // el: Add Expense: Main Form

    addExpenseBtn.addEventListener('click', openAddExpense);

    addExpenseBtnEdit.forEach(button => toggleHiddenForm(button, 'expense'));

    addExpenseHiddenFormBtnClose.forEach(button => {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        closeAddExpenseHiddenForm();
      });
    });

    addExpenseTitleInput.addEventListener('input', handleAddExpenseTitleInput);

    addExpenseAmountInput.addEventListener(
      'input',
      handleAddExpenseAmountInput
    );

    addExpenseDateInput.addEventListener('input', handleAddExpenseDateInput);

    // el: Add Expense: Payer Form

    payerAvatarColumns.forEach(column => {
      column.addEventListener('click', handlePayerAvatarClick);
    });

    payerSwitches.forEach(payerSwitch => {
      payerSwitch.addEventListener('change', handlePayerSwitch);
    });

    addPayerButton.addEventListener('click', handleAddPayerClick);

    // el: Add Expense: Splitt Form

    splittOptionButtons.forEach(splittOptionButton => {
      splittOptionButton.addEventListener('change', handleSplittOptionChange);
    });

    splittEquallyCheckboxes.forEach(checkbox =>
      checkbox.addEventListener('change', handleSplittEquallyCheckboxChange)
    );

    splittEquallyTableRows.forEach(row =>
      row.addEventListener('click', handleSplittEquallyRowClick)
    );

    splittPartsAmountInputs.forEach(inputAmount =>
      inputAmount.addEventListener('input', handleSplittPartsAmountInput)
    );

    splittPartsRows.forEach(row =>
      row.addEventListener('click', handleSplittPartsRowClick)
    );

    splittSharesInputs.forEach(inputShare =>
      inputShare.addEventListener('input', handleSplittSharesInput)
    );

    splittSharesRows.forEach(row =>
      row.addEventListener('click', handleSplittSharesRowClick)
    );

    // el: Add Expense: Note Form

    addExpenseNoteInput.addEventListener('input', () =>
      handleTransactionNoteInput(addExpenseNoteForm)
    );

    // el: Add Repayment: Main Form

    addRepaymentBtn.addEventListener('click', openAddRepayment);

    addRepaymentBtnEdit.forEach(button =>
      toggleHiddenForm(button, 'repayment')
    );

    addRepaymentHiddenFormBtnClose.forEach(button => {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        closeAddRepaymentHiddenForm();
      });
    });

    addRepaymentSwitchFrom.addEventListener(
      'change',
      handleAddRepaymentFromChange
    );

    addRepaymentSwitchTo.addEventListener('change', handleAddRepaymentToChange);

    addRepaymentAmountInput.addEventListener(
      'input',
      handleAddRepaymentAmountInput
    );

    // el: Add Repayment: Note Form

    addRepaymentNoteInput.addEventListener('input', () =>
      handleTransactionNoteInput(addRepaymentNoteForm)
    );

    // el: Delete Transactions

    deleteExpenseBtnClose.addEventListener(
      'click',
      handleDeleteExpenseCloseButtonClick
    );

    deleteExpenseBtnSubmit.addEventListener(
      'click',
      handleDeleteExpenseSubmitButtonClick
    );

    deleteRepaymentBtnClose.addEventListener(
      'click',
      handleDeleteRepaymentCloseButtonClick
    );

    deleteRepaymentBtnSubmit.addEventListener(
      'click',
      handleDeleteRepaymentSubmitButtonClick
    );

    // el: Transactions (Movements)

    transactionsTable.addEventListener('click', handleTransactionsTableClick);

    // el: Status

    statusContainer.addEventListener('click', handleStatusContainerClick);

    // el: Error

    errorOverlay.addEventListener('click', closeErrorModal);

    errorModalBtnClose.addEventListener('click', closeErrorModal);

    // el: Util

    btnClosePopup.forEach(button => {
      button.addEventListener('click', closeActiveModal);
    });
  });
}
