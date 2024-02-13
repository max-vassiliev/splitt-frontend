'use strict';

document.addEventListener('DOMContentLoaded', function () {
  let currentGroupId = 1;
  let activePopup = null;

  const openMenuPopupBtn = document.querySelector('.menu__btn--open');
  const closeMenuPopupBtn = document.querySelector('.menu__btn--close');
  const menuAccount = document.querySelector('.menu__account');
  const menuPopup = document.querySelector('.menu__popup');
  const groupHeader = document.querySelector('.group__info');
  const groupSettingsLink = document.querySelector('.link__group--settings');
  const groupPopup = document.querySelector('.group__popup');
  const closeGroupPopupBtn = document.querySelector('.group__btn--close');
  const groupSwitch = document.querySelector('.group__switch');
  const groupSwitchBtn = document.querySelector('.group__switch_btn');
  const addExpenseBtn = document.querySelector('.add--transaction__expense');
  const addRepaymentBtn = document.querySelector(
    '.add--transaction__repayment'
  );
  const overlay = document.querySelector('.overlay');

  // ----------
  // Functions
  // ----------

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

  // f: Expense

  function openAddExpense() {
    addOverlay();
  }

  function closeAddExpense() {
    hideOverlay();
  }

  // f: Repayment

  function openAddRepayment() {
    addOverlay();
  }

  function closeAddRepayment() {
    hideOverlay();
  }

  // ----------------
  // Event Listeners
  // ----------------

  openMenuPopupBtn.addEventListener('click', openMenuPopup);

  closeMenuPopupBtn.addEventListener('click', closeMenuPopup);

  menuAccount.addEventListener('click', openMenuPopup);

  groupHeader.addEventListener('click', openGroupPopup);

  closeGroupPopupBtn.addEventListener('click', closeGroupPopup);

  groupSettingsLink.addEventListener('click', function (event) {
    event.preventDefault();
    closeMenuPopup();
    openGroupPopup();
  });

  groupSwitch.addEventListener('change', handleGroupSwitchChange);

  addExpenseBtn.addEventListener('click', openAddExpense);

  addRepaymentBtn.addEventListener('click', openAddRepayment);

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
