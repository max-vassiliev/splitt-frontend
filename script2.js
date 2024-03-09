'use strict';

document.addEventListener('DOMContentLoaded', function () {
  let currentGroupId = 1;
  let activePopup = null;
  let activeAddExpenseHiddenForm = null;
  let activeAddRepaymentHiddenForm = null;
  let activeEmojiField = null;

  const ACTIVE_CLASS = 'active';
  const HIDDEN_CLASS = 'hidden';
  const DISABLED_ATTRIBUTE = 'disabled';

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
  const amountInput = document.querySelectorAll('.input-amount');
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
    // TODO1 удалить потом
    // console.log(emoji);
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

  amountInput.forEach(inputField => {
    inputField.addEventListener('input', handleAmountInput);
  });

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
