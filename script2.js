'use strict';

document.addEventListener('DOMContentLoaded', function () {
  const ACTIVE_CLASS = 'active';
  const INACTIVE_CLASS = 'inactive';
  const HIDDEN_CLASS = 'hidden';
  const DISABLED_ATTRIBUTE = 'disabled';
  const BELOW_EXPENSE_AMOUNT_CLASS = 'below-expense-amount';
  const ABOVE_EXPENSE_AMOUNT_CLASS = 'above-expense-amount';

  const MAX_AMOUNT = 10000000000;
  const DEFAULT_AMOUNT = 0;
  const ONE_HUNDRED_PERCENT = 100;

  let currentGroupId = 1;
  let activePopup = null;
  let activeAddExpenseHiddenForm = null;
  let activeAddRepaymentHiddenForm = null;
  let activeEmojiField = null;

  let addExpenseFormModel = {
    title: '',
    amount: 0,
    paidBy: {},
    splitt: {},
    comment: null,
  };

  let splittEquallyModel = {
    splittType: 'equally',
    element: null,
    splittAmounts: new Map(),
    splittFields: new Map(),
    checkedRows: new Set(),
    amountWidthOptions: new Map([
      [1, '6.7rem'],
      [2, '6.7rem'],
      [3, '6.7rem'],
      [4, '6.7rem'],
      [5, '6.7rem'],
      [6, '8.2rem'],
      [7, '9.2rem'],
      [8, '10.2rem'],
      [9, '12.5rem'],
      [10, '13.2rem'],
      [11, '14.2rem'],
    ]),
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
      [4, '8rem'],
      [5, '8rem'],
      [6, '10rem'],
      [7, '11rem'],
      [8, '12rem'],
      [9, '13rem'],
      [10, '14.5rem'],
      [11, '15rem'],
    ]),
  };

  function isActive(element) {
    return element.classList.contains(ACTIVE_CLASS);
  }

  function activate(element) {
    element.classList.add(ACTIVE_CLASS);
  }

  function deactivate(element) {
    element.classList.remove(ACTIVE_CLASS);
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

  // e: Menu
  const openMenuPopupBtn = document.querySelector('.menu__btn--open');
  const closeMenuPopupBtn = document.querySelector('.menu__btn--close');
  const menuAccount = document.querySelector('.menu__account');
  const menuPopup = document.querySelector('.menu__popup');

  // e: Utils
  const overlay = document.querySelector('.overlay');
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
  const addExpenseBtnEdit = document.querySelectorAll('.add-expense__btn-edit');
  const addExpenseAmountInput = document.querySelector('.add-expense-amount');
  const addExpenseEmojiInputField = document.querySelector(
    '.emoji-input.add-expense'
  );
  const addExpenseEmojiPickerSwitchBtn = document.querySelector(
    '.btn__emoji-picker--switch.add-expense'
  );
  const addExpenseEmojiRemoveBtn = document.querySelector(
    '.btn__emoji-remove.add-expense'
  );
  const addExpenseHiddenFormBtnClose = document.querySelectorAll(
    '.add-expense__form_btn-close'
  );

  // e: Add Expense: Splitt Form
  const splittOptionButtons = document.querySelectorAll(
    '.splitt-form__toggle input[type="radio"]'
  );

  const splittFormContainer = document.querySelector('.splitt-form-container');

  const splittSubmitBtn = document.querySelector(
    '.add-expense__form_splitt__btn--submit'
  );

  // TODO1: пересмотреть; есть два элемента с классом 'splitt-calculator__remainder'
  const splittCalculatorRemainder = document.querySelector(
    '.splitt-calculator__remainder'
  );

  // e: Add Expense: Splitt Form - Equally
  const splittEquallyTable = document.getElementById('splitt-equally-table');
  const splittEquallyTableRows = document.querySelectorAll(
    '.splitt-equally-table-row'
  );
  const splittEquallyCheckboxes = document.querySelectorAll(
    '.splitt-equally-checkbox'
  );

  splittEquallyTableRows.forEach(row => {
    const userId = row.dataset.userId;
    const splittField = row.querySelector('.splitt-equally-amount');
    splittEquallyModel.splittAmounts.set(userId, DEFAULT_AMOUNT);
    splittEquallyModel.splittFields.set(userId, splittField);
    splittEquallyModel.checkedRows.add(userId);
  });

  activate(splittEquallyTable);
  splittEquallyModel.element = splittEquallyTable;
  addExpenseFormModel.splitt = splittEquallyModel;

  // e: Add Expense: Splitt Form - Parts
  const splittPartsTable = document.getElementById('splitt-parts-table');
  const splittPartsRows = document.querySelectorAll('.splitt-parts-table-row');
  const splittPartsTotalField = document.querySelector('.splitt-parts__total');
  const splittPartsRemainderField = document.querySelector(
    '.splitt-parts__remainder'
  );
  const splittPartsAmountInputs = document.querySelectorAll(
    '.splitt-parts-amount'
  );
  const splittPartsRowsArray = [...splittPartsRows];
  splittPartsRowsArray.forEach(row => {
    const userId = parseInt(row.dataset.userId, 10);
    const amountField = row.querySelector('.splitt-parts-amount');
    splittPartsModel.splittAmounts.set(userId, 0);
    splittPartsModel.splittFields.set(userId, amountField);
  });
  splittPartsModel.totalField = splittPartsTotalField;
  splittPartsModel.remainderField = splittPartsRemainderField;
  splittPartsModel.element = splittPartsTable;

  // e: Add Expense: Splitt Form - Shares
  const splittSharesTable = document.getElementById('splitt-shares-table');
  const splittSharesRows = document.querySelectorAll(
    '.splitt-shares-table-row'
  );
  const splittSharesTotalShareField = document.querySelector(
    '.splitt-shares__total-share'
  );
  const splittSharesTotalAmountField = document.querySelector(
    '.splitt-shares__total-amount'
  );
  const splittSharesRemainderRow = document.querySelector(
    '.splitt-shares-remainder-row'
  );
  const splittSharesRemainderShareField = document.querySelector(
    '.splitt-shares__remainder-share'
  );
  const splittSharesRemainderAmountField = document.querySelector(
    '.splitt-shares__remainder-amount'
  );
  const splittSharesInputs = document.querySelectorAll('.splitt-share__input');
  const splittSharesRowsArray = [...splittSharesRows];
  splittSharesRowsArray.forEach(row => {
    const userId = parseInt(row.dataset.userId, 10);
    const amountField = row.querySelector('.splitt-share__amount');
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
  const addExpenseNoteBtnCancel = document.querySelector(
    '.add-expense__form_btn-cancel'
  );
  const addExpenseNoteBtnSave = document.querySelector(
    '.add-expense__form_note__btn--save'
  );

  const addExpenseNoteForm = {
    noteInput: addExpenseNoteInput,
    counter: addExpenseNoteCounter,
    saveButton: addExpenseNoteBtnSave,
    cancelButton: addExpenseNoteBtnCancel,
    isExpense: true,
  };

  // e: Add Repayment: Main Form
  const addRepaymentBtn = document.querySelector('.add-repayment__btn');
  const addRepaymentForm = document.querySelector('.add-repayment__form');
  const addRepaymentBtnEdit = document.querySelectorAll(
    '.add-repayment__btn-edit'
  );
  const addRepaymentHiddenFormBtnClose = document.querySelectorAll(
    '.add-repayment__form_btn-close'
  );
  const addRepaymentAmountInput = document.querySelector(
    '.add-repayment-amount'
  );
  const addRepaymentEmojiInputField = document.querySelector(
    '.emoji-input.add-repayment'
  );
  const addRepaymentEmojiPickerSwitchBtn = document.querySelector(
    '.btn__emoji-picker--switch.add-repayment'
  );
  const addRepaymentEmojiRemoveBtn = document.querySelector(
    '.btn__emoji-remove.add-repayment'
  );

  // e: Add Repayment: Note Form
  const addRepaymentNoteInput = document.querySelector(
    '.add-transaction__form_input-note#repayment-note'
  );
  const addRepaymentNoteCounter = document.querySelector(
    '.character-count.repayment-note'
  );
  const addRepaymentNoteBtnCancel = document.querySelector(
    '.add-repayment__form_btn-cancel'
  );
  const addRepaymentNoteBtnSave = document.querySelector(
    '.add-repayment__form_note__btn--save'
  );
  const addRepaymentNoteForm = {
    noteInput: addRepaymentNoteInput,
    counter: addRepaymentNoteCounter,
    saveButton: addRepaymentNoteBtnSave,
    cancelButton: addRepaymentNoteBtnCancel,
    isExpense: false,
  };

  // ---------------
  // Functions (f:)
  // ---------------

  // f: Util

  function addOverlay() {
    overlay.classList.remove('hidden');
  }

  function hideOverlay() {
    overlay.classList.add('hidden');
  }

  function closeActivePopup() {
    if (!activePopup) return;
    hideOverlay();
    activePopup.classList.remove(ACTIVE_CLASS);
    activePopup = null;
  }

  function parseInputAmount(value) {
    const cleanedValue = value.replace(/\D/g, '');
    return cleanedValue ? parseInt(cleanedValue) : 0;
  }

  function verifyInputAmount(amount) {
    return amount > MAX_AMOUNT ? Math.floor(amount / 10) : amount;
  }

  function verifySplittInputAmount(amount) {
    // TODO1 удалить
    // console.log('verifySplittInputAmount()');
    // console.log(amount);
    // console.log(addExpenseFormModel.amount);

    // return amount > addExpenseFormModel.amount
    //   ? Math.floor(amount / 10)
    //   : amount;

    const verifiedAmount =
      amount > addExpenseFormModel.amount ? Math.floor(amount / 10) : amount;

    // TODO1 удалить
    // console.log(verifiedAmount);

    return verifiedAmount;
  }

  function processInputAmount(value) {
    const parsedAmount = parseInputAmount(value);
    return verifyInputAmount(parsedAmount);
  }

  // TODO1: удалить
  function processSplittInputAmount(value) {
    const parsedAmount = parseInputAmount(value);
    return verifySplittInputAmount(parsedAmount);
  }

  function formatAmountForOutput(amount) {
    let formattedAmount = (amount / 100).toLocaleString('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    formattedAmount += ' ₽';

    return formattedAmount;
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

  function parsePercentInputString(value) {
    let percent;
    let cleanedValue = value.replace(/\D/g, '');

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

  function formatPercentString(value) {
    let percent;
    let cleanedValue = value.replace(/\D/g, '');

    if (cleanedValue === '' || isNaN(cleanedValue)) {
      percent = 0;
    } else {
      let finalPercent;
      let cleanedValueParsed = parseInt(cleanedValue);
      cleanedValueParsed > 100
        ? (finalPercent = Math.floor(cleanedValueParsed / 10))
        : (finalPercent = cleanedValueParsed);

      percent = Math.max(finalPercent, 0);
    }

    let formattedPercent = percent + ' %';
    return formattedPercent;
  }

  // TODO1 разбить на функции — process и format
  function formatPercentForOutput(value) {
    let finalPercent;
    value > 100
      ? (finalPercent = Math.floor(value / 10))
      : (finalPercent = value);

    return `${value} %`;
  }

  function formatPercentForOutputLite(value) {
    return `${value} %`;
  }

  function handlePercentInput(event) {
    const cursorPosition = this.selectionStart;
    let currentValue = event.target.value;

    const formattedPercent = formatPercentString(currentValue);
    const lengthDifference = formattedPercent.length - currentValue.length;

    this.value = formattedPercent;

    let newCursorPosition = cursorPosition + lengthDifference;
    newCursorPosition = Math.max(
      0,
      Math.min(this.value.length, newCursorPosition)
    );
    this.setSelectionRange(newCursorPosition, newCursorPosition);
  }

  // f: Menu

  function handleClickOutsideMenuPopup(event) {
    const isClickInsideMenuPopup = menuPopup.contains(event.target);
    const isClickOnOpenButton = openMenuPopupBtn.contains(event.target);
    const isClickOnMenuAccount = menuAccount.contains(event.target);

    if (
      !isClickInsideMenuPopup &&
      !isClickOnOpenButton &&
      !isClickOnMenuAccount
    ) {
      closeMenuPopup();
    }
  }

  function openMenuPopup() {
    menuPopup.classList.add(ACTIVE_CLASS);
    document.addEventListener('click', handleClickOutsideMenuPopup);
  }

  function closeMenuPopup() {
    menuPopup.classList.remove(ACTIVE_CLASS);
    document.removeEventListener('click', handleClickOutsideMenuPopup);
  }

  // f: Group

  function openGroupPopup() {
    addOverlay();
    groupPopup.classList.add(ACTIVE_CLASS);
    activePopup = groupPopup;
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
      emojiInputField,
      emojiPickerSwitchBtn,
      emojiRemoveBtn
    ) {
      this.emojiInputField = emojiInputField;
      this.emojiPickerSwitchBtn = emojiPickerSwitchBtn;
      this.emojiRemoveBtn = emojiRemoveBtn;
    },
  };

  const addExpenseEmojiField = Object.create(emojiField);
  const addRepaymentEmojiField = Object.create(emojiField);

  addExpenseEmojiField.constructor(
    addExpenseEmojiInputField,
    addExpenseEmojiPickerSwitchBtn,
    addExpenseEmojiRemoveBtn
  );

  addRepaymentEmojiField.constructor(
    addRepaymentEmojiInputField,
    addRepaymentEmojiPickerSwitchBtn,
    addRepaymentEmojiRemoveBtn
  );

  function openEmojiInput() {
    if (isActive(activeEmojiField.emojiInputField)) {
      return;
    }
    activeEmojiField.emojiPickerSwitchBtn.classList.add(HIDDEN_CLASS);
    activeEmojiField.emojiInputField.classList.add(ACTIVE_CLASS);
    activeEmojiField.emojiRemoveBtn.classList.add(ACTIVE_CLASS);
  }

  function removeEmoji() {
    activeEmojiField.emojiInputField.value = '';
    activeEmojiField.emojiInputField.classList.remove(ACTIVE_CLASS);
    activeEmojiField.emojiRemoveBtn.classList.remove(ACTIVE_CLASS);
    activeEmojiField.emojiPickerSwitchBtn.classList.remove(HIDDEN_CLASS);
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

  function countNoteLength(counter, inputText) {
    counter.textContent = inputText.length;
  }

  function handleSaveNote(event, form) {
    event.preventDefault();
    closeHiddenForm(form.isExpense);
  }

  function changeMainFormButtonText(text, isExpense) {
    isExpense
      ? (activeAddExpenseHiddenForm.button.textContent = text)
      : (activeAddRepaymentHiddenForm.button.textContent = text);
  }

  function toggleNoteSaveBtn(form) {
    if (!isEmptyString(form.noteInput.value) && !isActive(form.saveButton)) {
      activate(form.saveButton);
      form.saveButton.removeAttribute(DISABLED_ATTRIBUTE);
      changeMainFormButtonText('редактировать', form.isExpense);
    }
    if (isEmptyString(form.noteInput.value) && isActive(form.saveButton)) {
      deactivate(form.saveButton);
      form.saveButton.setAttribute(DISABLED_ATTRIBUTE, DISABLED_ATTRIBUTE);
      changeMainFormButtonText('написать', form.isExpense);
    }
  }

  function closeHiddenForm(isExpense) {
    isExpense ? closeAddExpenseHiddenForm() : closeAddRepaymentHiddenForm();
  }

  function handleTransactionNoteInput(noteForm) {
    removeWhiteSpace(noteForm.noteInput);
    countNoteLength(noteForm.counter, noteForm.noteInput.value);
    toggleNoteSaveBtn(noteForm);
  }

  function handleTransactionNoteCancel(event, noteForm) {
    event.preventDefault();
    clearText(noteForm.noteInput);
    countNoteLength(noteForm.counter, noteForm.noteInput.value);
    toggleNoteSaveBtn(noteForm);
    closeHiddenForm(noteForm.isExpense);
  }

  // f: Add Expense

  function openAddExpense() {
    addOverlay();
    addExpenseForm.classList.add(ACTIVE_CLASS);
    activePopup = addExpenseForm;
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

  function handleAddExpenseAmountInput(event) {
    const cursorPosition = this.selectionStart;
    const inputAmount = event.target.value;
    const processedAmount = processInputAmount(inputAmount);
    saveAddExpenseAmount(processedAmount);
    const outputAmount = formatAmountForOutput(processedAmount);
    this.value = outputAmount;
    setAmountCursorPosition(inputAmount, outputAmount, cursorPosition, this);
  }

  function saveAddExpenseAmount(amount) {
    addExpenseFormModel.amount = amount;
    updateSplitts();
  }

  // f: Add Expense: Splitt Form

  function selectSplittForm(splittType) {
    let selectedSplittForm;
    switch (splittType) {
      case 'parts':
        selectedSplittForm = splittPartsModel;
        break;
      case 'shares':
        selectedSplittForm = splittSharesModel;
        break;
      default:
        selectedSplittForm = splittEquallyModel;
    }
    return selectSplittForm;
  }

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
        loadSplittPartsForm();
        break;
      case 'shares':
        selectedSplittForm = splittSharesModel;
        loadSplittSharesForm();
        break;
      default:
        selectedSplittForm = splittEquallyModel;
        updateSplittsEqually();
    }

    addExpenseFormModel.splitt = selectedSplittForm;
    activate(addExpenseFormModel.splitt.element);
  }

  function loadSplittSharesForm() {
    calculateSplittSharesAmounts();
    calculateSplittShares();
    renderSplittShares();
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

  function handleSplittEquallyCheckboxChange() {
    const row = this.closest('.splitt-equally-table-row');
    const userId = row.dataset.userId;
    const isChecked = this.checked;

    // TODO1 надо ли добавлять INACTIVE_CLASS?
    if (!isChecked) {
      splittEquallyModel.checkedRows.delete(userId);
      splittEquallyModel.splittAmounts.set(userId, DEFAULT_AMOUNT);
    } else {
      splittEquallyModel.checkedRows.add(userId);
    }

    updateSplittsEqually();
  }

  function setDefaultSplittsEqually() {
    splittEquallyModel.splittAmounts.forEach((_, userId, splittsMap) => {
      splittsMap.set(userId, DEFAULT_AMOUNT);
    });
  }

  function updateSplittsEqually() {
    const checkedRowsCount = splittEquallyModel.checkedRows.size;
    if (addExpenseFormModel.amount === 0 || checkedRowsCount === 0) {
      setDefaultSplittsEqually();
      renderSplittEqually();
      return;
    }

    let baseAmount = 0;
    let remainder = 0;
    if (checkedRowsCount > 0) {
      baseAmount = Math.floor(addExpenseFormModel.amount / checkedRowsCount);
      remainder = addExpenseFormModel.amount % checkedRowsCount;
    }

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

    renderSplittEqually();
    adjustSplittEquallyColumnWidth();
  }

  function renderSplittEqually() {
    splittEquallyModel.splittAmounts.forEach((splittAmount, userId) => {
      const splittField = splittEquallyModel.splittFields.get(userId);
      splittField.textContent = formatAmountForOutput(splittAmount);
    });
  }

  function adjustSplittEquallyColumnWidth() {
    const referenceAmountLength = addExpenseFormModel.amount.toString().length;
    const adjustedWidth =
      splittEquallyModel.amountWidthOptions.get(referenceAmountLength) ||
      '14rem';
    splittEquallyModel.splittFields.forEach(field => {
      field.style.width = adjustedWidth;
    });
  }

  function selectUsersWithHigherAmounts(users, count) {
    if (count === 0) return new Set();
    let usersToSelect = Array.from(users);
    usersToSelect.sort(() => Math.random() - 0.5);
    let selectedUsers = usersToSelect.slice(0, count);
    return new Set(selectedUsers);
  }

  // TODO1 проверить целесообразность
  function updateSplittsParts() {
    calculateSplittParts();
  }

  // TODO1 проверить целесообразность
  function loadSplittPartsForm() {
    calculateSplittParts();
  }

  // TODO1:
  function calculateSplittParts() {
    const total = Array.from(splittPartsModel.splittAmounts.values()).reduce(
      (acc, currentValue) => acc + currentValue,
      0
    );

    splittPartsModel.total = total;
    splittPartsModel.remainder =
      addExpenseFormModel.amount - splittPartsModel.total;

    splittPartsModel.totalField.textContent = formatAmountForOutput(
      splittPartsModel.total
    );
    splittPartsModel.remainderField.textContent = formatAmountForOutput(
      splittPartsModel.remainder
    );

    restyleSplittRemainder(
      splittPartsModel.remainder,
      splittCalculatorRemainder
    );

    adjustSplittPartsColumnWidth();
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
    splittPartsModel.totalField.style.width = adjustedWidth;
    splittPartsModel.remainderField.style.width = adjustedWidth;
  }

  function handleSplittPartsAmountInput(event) {
    const cursorPosition = this.selectionStart;
    const inputAmount = event.target.value;
    const row = this.closest('.splitt-parts-table-row');
    const userId = row.dataset.userId;

    const processedAmount = processInputAmount(inputAmount);
    splittPartsModel.splittAmounts.set(userId, processedAmount);
    calculateSplittParts();

    const outputAmount = formatAmountForOutput(
      splittPartsModel.splittAmounts.get(userId)
    );
    this.value = outputAmount;
    setAmountCursorPosition(inputAmount, outputAmount, cursorPosition, this);
  }

  // TODO1 проверить целесообразность
  function updateSplittsShares() {
    calculateSplittSharesAmounts();
    calculateSplittShares();
    renderSplittShares();
  }

  function handleSplittSharesInput(event) {
    const cursorPosition = this.selectionStart;
    const inputValue = event.target.value;
    const row = this.closest('.splitt-shares-table-row');
    const userId = parseInt(row.dataset.userId, 10);

    const splittShare = parsePercentInputString(inputValue);
    const splittAmount = calculateSplittShareAmount(
      splittShare,
      addExpenseFormModel.amount
    );

    splittSharesModel.splittShares.set(userId, splittShare);
    splittSharesModel.splittAmounts.set(userId, splittAmount);
    calculateSplittShares();
    renderSplittShares();

    const splittShareOut = formatPercentForOutputLite(splittShare);
    this.value = splittShareOut;

    setAmountCursorPosition(inputValue, splittShareOut, cursorPosition, this);
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
    // calculateSplittSharesAmounts();

    const totalAmount = Array.from(
      splittSharesModel.splittAmounts.values()
    ).reduce((acc, currentValue) => acc + currentValue, 0);

    const totalShare = Array.from(
      splittSharesModel.splittShares.values()
    ).reduce((acc, currentValue) => acc + currentValue, 0);

    splittSharesModel.totalAmount = totalAmount;
    splittSharesModel.totalShare = totalShare;

    splittSharesModel.remainderAmount =
      addExpenseFormModel.amount - splittSharesModel.totalAmount;

    splittSharesModel.remainderShare =
      addExpenseFormModel.amount === 0 ? 0 : ONE_HUNDRED_PERCENT - totalShare;
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
    splittSharesModel.remainderAmountField.textContent = formatAmountForOutput(
      splittSharesModel.remainderAmount
    );

    splittSharesModel.totalShareField.textContent = formatPercentForOutput(
      splittSharesModel.totalShare
    );
    splittSharesModel.remainderShareField.textContent = formatPercentForOutput(
      splittSharesModel.remainderShare
    );

    restyleSplittRemainder(
      splittSharesModel.remainderShare,
      splittSharesRemainderRow
    );

    adjustSplittSharesColumnWidth();
  }

  function adjustSplittSharesColumnWidth() {
    const referenceAmount =
      addExpenseFormModel.amount > splittSharesModel.totalAmount
        ? addExpenseFormModel.amount
        : splittSharesModel.totalAmount;

    const expenseAmountLength = referenceAmount.toString().length;
    const adjustedWidth =
      splittSharesModel.amountWidthOptions.get(expenseAmountLength) || '14rem';

    splittSharesModel.splittAmountsFields.forEach(field => {
      field.style.width = adjustedWidth;
    });

    splittSharesModel.totalAmountField.style.width = adjustedWidth;
    splittSharesModel.remainderAmountField.style.width = adjustedWidth;
  }

  function restyleSplittRemainder(remainder, remainderRow) {
    if (remainder === 0) {
      remainderRow.classList.remove(BELOW_EXPENSE_AMOUNT_CLASS);
      remainderRow.classList.remove(ABOVE_EXPENSE_AMOUNT_CLASS);
      return;
    }
    if (
      remainder < 0 &&
      !remainderRow.classList.contains(ABOVE_EXPENSE_AMOUNT_CLASS)
    ) {
      remainderRow.classList.remove(BELOW_EXPENSE_AMOUNT_CLASS);
      remainderRow.classList.add(ABOVE_EXPENSE_AMOUNT_CLASS);
      return;
    }
    if (
      remainder > 0 &&
      !remainderRow.classList.contains(BELOW_EXPENSE_AMOUNT_CLASS)
    ) {
      remainderRow.classList.remove(ABOVE_EXPENSE_AMOUNT_CLASS);
      remainderRow.classList.add(BELOW_EXPENSE_AMOUNT_CLASS);
    }
  }

  function closeAddExpenseHiddenForm() {
    activeAddExpenseHiddenForm.form.classList.remove(ACTIVE_CLASS);
    activeAddExpenseHiddenForm.button.classList.remove(ACTIVE_CLASS);
    activeAddExpenseHiddenForm = null;
  }

  // f: Add Repayment

  function openAddRepayment() {
    addOverlay();
    addRepaymentForm.classList.add(ACTIVE_CLASS);
    activePopup = addRepaymentForm;
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

  function handleAddRepaymentAmountInput(event) {
    const cursorPosition = this.selectionStart;
    const inputAmount = event.target.value;
    const processedAmount = processInputAmount(inputAmount);
    const outputAmount = formatAmountForOutput(processedAmount);
    this.value = outputAmount;
    setAmountCursorPosition(inputAmount, outputAmount, cursorPosition, this);
  }

  // ----------------------
  // Event Listeners (el:)
  // ----------------------

  // f: Auxiliary

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

  // el: Menu

  openMenuPopupBtn.addEventListener('click', openMenuPopup);

  menuAccount.addEventListener('click', openMenuPopup);

  closeMenuPopupBtn.addEventListener('click', closeMenuPopup);

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

  addExpenseEmojiRemoveBtn.addEventListener('click', function () {
    activeEmojiField = addExpenseEmojiField;
    removeEmoji();
  });

  addRepaymentEmojiPickerSwitchBtn.addEventListener('click', function (event) {
    activeEmojiField = addRepaymentEmojiField;
    toggleEmojiPicker(event);
  });

  addRepaymentEmojiInputField.addEventListener('click', function (event) {
    activeEmojiField = addRepaymentEmojiField;
    toggleEmojiPicker(event);
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

  addExpenseAmountInput.addEventListener('input', handleAddExpenseAmountInput);

  // el: Add Expense: Splitt Form

  splittOptionButtons.forEach(splittOptionButton => {
    splittOptionButton.addEventListener('change', handleSplittOptionChange);
  });

  splittEquallyCheckboxes.forEach(checkbox =>
    checkbox.addEventListener('change', handleSplittEquallyCheckboxChange)
  );

  splittPartsAmountInputs.forEach(inputAmount =>
    inputAmount.addEventListener('input', handleSplittPartsAmountInput)
  );

  splittSharesInputs.forEach(inputShare =>
    inputShare.addEventListener('input', handleSplittSharesInput)
  );

  // splittFormContainer.addEventListener('click')

  // el: Add Expense: Note Form

  addExpenseNoteInput.addEventListener('input', () =>
    handleTransactionNoteInput(addExpenseNoteForm)
  );

  addExpenseNoteBtnCancel.addEventListener('click', function (event) {
    handleTransactionNoteCancel(event, addExpenseNoteForm);
  });

  addExpenseNoteBtnSave.addEventListener('click', event =>
    handleSaveNote(event, addExpenseNoteForm)
  );

  // el: Add Repayment: Main Form

  addRepaymentBtn.addEventListener('click', openAddRepayment);

  addRepaymentBtnEdit.forEach(button => toggleHiddenForm(button, 'repayment'));

  addRepaymentHiddenFormBtnClose.forEach(button => {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      closeAddRepaymentHiddenForm();
    });
  });

  addRepaymentAmountInput.addEventListener(
    'input',
    handleAddRepaymentAmountInput
  );

  // el: Add Repayment: Note Form

  addRepaymentNoteInput.addEventListener('input', () =>
    handleTransactionNoteInput(addRepaymentNoteForm)
  );

  addRepaymentNoteBtnCancel.addEventListener('click', function (event) {
    handleTransactionNoteCancel(event, addRepaymentNoteForm);
  });

  addRepaymentNoteBtnSave.addEventListener('click', event =>
    handleSaveNote(event, addRepaymentNoteForm)
  );

  // el: Util

  overlay.addEventListener('click', closeActivePopup);

  // TODO1: удалить при случае
  // percentInput.forEach(inputField => {
  //   inputField.addEventListener('input', handlePercentInput);
  // });

  btnClosePopup.forEach(button => {
    button.addEventListener('click', closeActivePopup);
  });

  // TODO1: to delete: enable Splitt Form

  const addExpenseHiddenFormSplitt = document.querySelector(
    '.add-transaction__form_hidden.add-expense__form_splitt'
  );
  openAddExpense();
  addExpenseHiddenFormSplitt.classList.add(ACTIVE_CLASS);
  activeAddExpenseHiddenForm = addExpenseHiddenFormSplitt;

  // TODO1: to delete: enable Note Form
  // const addExpenseHiddenFormNote = document.querySelector(
  //   '.add-transaction__form_hidden.add-expense__form_note'
  // );
  // openAddExpense();
  // addExpenseHiddenFormNote.classList.add(ACTIVE_CLASS);
  // activeAddExpenseHiddenForm = addExpenseHiddenFormNote;
});
