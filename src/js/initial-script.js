'use strict';

import { ACTIVE_CLASS } from './util/Config.js';

export function initializeLegacyScript() {
  document.addEventListener('DOMContentLoaded', function () {
    // --------------
    // Elements (e:)
    // --------------

    // e: Utils

    const btnClosePopup = document.querySelectorAll('.btn__close_popup');

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
      // modalService.closeActiveModal();
    }

    // f: Delete Transactions: Expense

    function openDeleteExpense() {
      // modalService.openModal(deleteExpenseModal);
    }

    function handleDeleteExpenseCloseButtonClick() {
      // modalService.closeActiveModal();
    }

    function handleDeleteExpenseSubmitButtonClick() {
      console.log('DELETE: Expense');
    }

    // f: Delete Transactions: Repayment

    function openDeleteRepayment() {
      modalService.openModal(deleteRepaymentModal);
    }

    function handleDeleteRepaymentCloseButtonClick() {
      // modalService.closeActiveModal();
    }

    function handleDeleteRepaymentSubmitButtonClick() {
      console.log('DELETE: Repayment');
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
    // Event Listeners (el:)
    // ----------------------

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

    // el: Error

    errorOverlay.addEventListener('click', closeErrorModal);

    errorModalBtnClose.addEventListener('click', closeErrorModal);

    // el: Util

    btnClosePopup.forEach(button => {
      button.addEventListener('click', closeActiveModal);
    });
  });
}
