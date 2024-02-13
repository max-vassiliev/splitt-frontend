'use strict';

document.addEventListener('DOMContentLoaded', function () {
  let currentGroupId = 1;
  let activePopup = null;

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

  // e: Group
  const groupHeader = document.querySelector('.group__info');
  const groupSettingsLink = document.querySelector('.link__group--settings');
  const groupPopup = document.querySelector('.group__popup');
  const groupPopupBtnClose = document.querySelector('.group__btn--close');
  const groupSwitch = document.querySelector('.group__switch');
  const groupSwitchBtn = document.querySelector('.group__switch_btn');

  // e: Add Expense
  const addExpenseBtn = document.querySelector('.add-expense__btn');
  const addExpenseForm = document.querySelector('.add-expense__form');
  const addExpenseFormMain = document.querySelector('.add-expense__form_main');
  const addExpenseBtnEditPayer = document.querySelector(
    '.add-expense__btn-edit-payer'
  );
  const addExpenseBtnEditSplitt = document.querySelector(
    '.add-expense__btn-edit-splitt'
  );
  const addExpenseBtnClose = document.querySelector('.add-expense__btn--close');
  const addExpenseAmountInput = document.querySelector(
    '.input__expense-amount'
  );
  const addExpenseFormPayer = document.querySelector(
    '.add-expense__form_payer'
  );
  const addExpenseFormPayerBtnClose = document.querySelector(
    '.add-expense__form_payer__btn--close'
  );
  const addExpenseFormSplitt = document.querySelector(
    '.add-expense__form_splitt'
  );
  const addExpenseFormSplittBtnClose = document.querySelector(
    '.add-expense__form_splitt__btn--close'
  );

  // e: Add Repayment
  const addRepaymentBtn = document.querySelector('.add-repayment__btn');

  // ---------------
  // Functions (f:)
  // ---------------

  // f: Util

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

  // f: Overlay

  function addOverlay() {
    overlay.classList.remove('hidden');
  }

  function hideOverlay() {
    overlay.classList.add('hidden');
    if (activePopup) {
      activePopup.classList.remove('active');
      activePopup = null;
    }
  }

  // f: Group

  function openGroupPopup() {
    addOverlay();
    groupPopup.classList.add('active');
    activePopup = groupPopup;
  }

  function closeGroupPopup() {
    groupPopup.classList.remove('active');
    hideOverlay();
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
    addExpenseForm.classList.add('active');
    activePopup = addExpenseForm;
  }

  function closeAddExpense() {
    addExpenseForm.classList.remove('active');
    hideOverlay();
  }

  function openAddExpensePayer() {
    addExpenseFormPayer.classList.add('active');
    addExpenseBtnEditPayer.classList.add('active');
  }

  function closeAddExpensePayer() {
    addExpenseFormPayer.classList.remove('active');
    addExpenseBtnEditPayer.classList.remove('active');
  }

  function toggleAddExpenseFormPayerView() {
    if (addExpenseBtnEditPayer.classList.contains('active')) {
      closeAddExpensePayer();
    } else {
      openAddExpensePayer();
    }
  }

  function openAddExpenseSplitt() {
    addExpenseFormSplitt.classList.add('active');
    addExpenseBtnEditSplitt.classList.add('active');
  }

  function closeAddExpenseSplitt() {
    addExpenseFormSplitt.classList.remove('active');
    addExpenseBtnEditSplitt.classList.remove('active');
  }

  function toggleAddExpenseFormSplittView() {
    if (addExpenseBtnEditSplitt.classList.contains('active')) {
      closeAddExpenseSplitt();
    } else {
      openAddExpenseSplitt();
    }
  }

  function toggleAddExpenseAdditionalForms() {
    if (addExpenseBtnEditPayer.classList.contains('active')) {
      closeAddExpensePayer();
    }
    if (addExpenseBtnEditSplitt.classList.contains('active')) {
      closeAddExpenseSplitt();
    }
  }

  // f: Add Repayment

  function openAddRepayment() {
    addOverlay();
  }

  function closeAddRepayment() {
    hideOverlay();
  }

  // ----------------------
  // Event Listeners (el:)
  // ----------------------

  // el: Menu

  openMenuPopupBtn.addEventListener('click', openMenuPopup);

  closeMenuPopupBtn.addEventListener('click', closeMenuPopup);

  menuAccount.addEventListener('click', openMenuPopup);

  // el: Group

  groupHeader.addEventListener('click', openGroupPopup);

  groupPopupBtnClose.addEventListener('click', closeGroupPopup);

  groupSettingsLink.addEventListener('click', function (event) {
    event.preventDefault();
    closeMenuPopup();
    openGroupPopup();
  });

  groupSwitch.addEventListener('change', handleGroupSwitchChange);

  // el: Add Expense

  addExpenseBtn.addEventListener('click', openAddExpense);

  addExpenseBtnClose.addEventListener('click', closeAddExpense);

  addExpenseAmountInput.addEventListener('input', handleAmountInput);

  addExpenseBtnEditPayer.addEventListener('click', function (event) {
    event.preventDefault();
    toggleAddExpenseAdditionalForms();
    toggleAddExpenseFormPayerView();
  });

  addExpenseFormPayerBtnClose.addEventListener('click', function (event) {
    event.preventDefault();
    closeAddExpensePayer();
  });

  addExpenseBtnEditSplitt.addEventListener('click', function (event) {
    event.preventDefault();
    toggleAddExpenseAdditionalForms();
    toggleAddExpenseFormSplittView();
  });

  addExpenseFormSplittBtnClose.addEventListener('click', function (event) {
    event.preventDefault();
    closeAddExpenseSplitt();
  });

  // el: Add Repayment

  addRepaymentBtn.addEventListener('click', openAddRepayment);

  // el: Util

  overlay.addEventListener('click', hideOverlay);

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
});
