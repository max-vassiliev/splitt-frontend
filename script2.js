'use strict';

document.addEventListener('DOMContentLoaded', function () {
  let currentGroupId = 1;
  let activePopup = null;
  let activeAddExpenseHiddenForm = null;
  let activeAddRepaymentHiddenForm = null;
  let activeEmojiField = null;

  const ACTIVE_CLASS = 'active';
  const HIDDEN_CLASS = 'hidden';

  function isActive(element) {
    return element.classList.contains(ACTIVE_CLASS);
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
  const amountInput = document.querySelectorAll('.input-amount');
  const btnClosePopup = document.querySelectorAll('.btn__close_popup');

  // e: Emoji Picker

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

  const emojiPickerContainer = document.querySelector(
    '.emoji-picker-container'
  );
  const addExpenseEmojiInputField = document.querySelector(
    '.emoji-input.add-expense'
  );
  const addExpenseEmojiPickerSwitchBtn = document.querySelector(
    '.btn__emoji-picker--switch.add-expense'
  );
  const addExpenseEmojiRemoveBtn = document.querySelector(
    '.btn__emoji-remove.add-expense'
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
    console.log('openEmojiInput');
    activeEmojiField.emojiPickerSwitchBtn.classList.add(HIDDEN_CLASS);
    activeEmojiField.emojiInputField.classList.add(ACTIVE_CLASS);
    activeEmojiField.emojiRemoveBtn.classList.add(ACTIVE_CLASS);
  }

  function removeEmoji() {
    console.log('removeEmoji');
    activeEmojiField.emojiInputField.value = '';
    activeEmojiField.emojiInputField.classList.remove(ACTIVE_CLASS);
    activeEmojiField.emojiRemoveBtn.classList.remove(ACTIVE_CLASS);
    activeEmojiField.emojiPickerSwitchBtn.classList.remove(HIDDEN_CLASS);
    activeEmojiField = null;
  }

  function openEmojiPicker() {
    if (isActive(emojiPickerContainer)) return;
    console.log('openEmojiPicker');
    emojiPickerContainer.classList.add(ACTIVE_CLASS);
    document.addEventListener('click', clickOutsideEmojiPicker);
  }

  function closeEmojiPicker() {
    if (!isActive(emojiPickerContainer)) return;
    console.log('closeEmojiPicker');
    emojiPickerContainer.classList.remove(ACTIVE_CLASS);
    document.removeEventListener('click', clickOutsideEmojiPicker);
  }

  function toggleEmojiPicker(event) {
    console.log('toggleEmojiPicker');
    !isActive(emojiPickerContainer) ? openEmojiPicker() : closeEmojiPicker();
    event.stopPropagation();
  }

  function clickOutsideEmojiPicker(event) {
    if (emojiPickerContainer.contains(event.target)) return;
    console.log('clickOutsideEmojiPicker');
    closeEmojiPicker();
  }

  function handleEmojiSelect(emoji) {
    openEmojiInput();
    activeEmojiField.emojiInputField.value = emoji.native;
    console.log(emoji);
  }

  const emojiPickerOptions = {
    onEmojiSelect: handleEmojiSelect,
    searchPosition: 'static',
    previewPosition: 'none',
    locale: 'ru',
  };

  const emojiPicker = new EmojiMart.Picker(emojiPickerOptions);
  document.getElementById('emoji-picker')?.appendChild(emojiPicker);

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

  // e: Group
  const groupHeader = document.querySelector('.group__info');
  const groupSettingsLink = document.querySelector('.link__group--settings');
  const groupPopup = document.querySelector('.group__popup');
  const groupSwitch = document.querySelector('.group__switch');
  const groupSwitchBtn = document.querySelector('.group__switch_btn');

  // e: Add Expense
  const addExpenseBtn = document.querySelector('.add-expense__btn');
  const addExpenseForm = document.querySelector('.add-expense__form');
  const addExpenseBtnEdit = document.querySelectorAll('.add-expense__btn-edit');
  const addExpenseHiddenFormBtnClose = document.querySelectorAll(
    '.add-expense__form_btn-close'
  );

  // e: Add Repayment
  const addRepaymentBtn = document.querySelector('.add-repayment__btn');
  const addRepaymentForm = document.querySelector('.add-repayment__form');
  const addRepaymentBtnEdit = document.querySelectorAll(
    '.add-repayment__btn-edit'
  );
  const addRepaymentHiddenFormBtnClose = document.querySelectorAll(
    '.add-repayment__form_btn-close'
  );

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

  function formatAmountString(value) {
    const cleanedValue = value.replace(/\D/g, '');

    const amount = cleanedValue ? parseInt(cleanedValue) / 100 : 0;

    let formattedAmount = amount.toLocaleString('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    formattedAmount += ' ₽';

    return formattedAmount;
  }

  function handleAmountInput(event) {
    const cursorPosition = this.selectionStart;
    const currentValue = event.target.value;
    const formattedAmount = formatAmountString(currentValue);
    const lengthDifference = formattedAmount.length - currentValue.length;

    this.value = formattedAmount;

    let newCursorPosition = cursorPosition + lengthDifference;
    newCursorPosition = Math.max(
      0,
      Math.min(this.value.length, newCursorPosition)
    );

    this.setSelectionRange(newCursorPosition, newCursorPosition);
  }

  // f: Menu

  function openMenuPopup() {
    menuPopup.classList.add('active');
  }

  function closeMenuPopup() {
    menuPopup.classList.remove('active');
  }

  // f: Group

  function openGroupPopup() {
    addOverlay();
    groupPopup.classList.add('active');
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
    if (groupSwitchBtn.classList.contains('active')) {
      groupSwitchBtn.classList.remove('active');
    }
  }

  function activateGroupSwitchBtn() {
    groupSwitchBtn.classList.add('active');
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

  closeMenuPopupBtn.addEventListener('click', closeMenuPopup);

  menuAccount.addEventListener('click', openMenuPopup);

  // el: Group

  groupHeader.addEventListener('click', openGroupPopup);

  groupSettingsLink.addEventListener('click', function (event) {
    event.preventDefault();
    closeMenuPopup();
    openGroupPopup();
  });

  groupSwitch.addEventListener('change', handleGroupSwitchChange);

  // el: Add Expense

  addExpenseBtn.addEventListener('click', openAddExpense);

  addExpenseBtnEdit.forEach(button => toggleHiddenForm(button, 'expense'));

  addExpenseHiddenFormBtnClose.forEach(button => {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      closeAddExpenseHiddenForm();
    });
  });

  // el: Add Repayment

  addRepaymentBtn.addEventListener('click', openAddRepayment);

  addRepaymentBtnEdit.forEach(button => toggleHiddenForm(button, 'repayment'));

  addRepaymentHiddenFormBtnClose.forEach(button => {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      closeAddRepaymentHiddenForm();
    });
  });

  // el: Util

  overlay.addEventListener('click', closeActivePopup);

  amountInput.forEach(inputField => {
    inputField.addEventListener('input', handleAmountInput);
  });

  btnClosePopup.forEach(button => {
    button.addEventListener('click', closeActivePopup);
  });

  document.addEventListener('click', function (event) {
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
  });

  // el: Emoji
});
