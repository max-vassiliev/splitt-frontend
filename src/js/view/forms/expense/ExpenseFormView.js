import {
  EXPENSE_HIDDEN_FORM_PAID_BY,
  EXPENSE_HIDDEN_FORM_SPLITT,
  EXPENSE_HIDDEN_FORM_NOTE,
} from '../../../util/Config.js';
import mainView from './subforms/main/ExpenseMainFormView.js';
import paidByView from './subforms/paid-by/ExpensePaidByView.js';
import splittView from './subforms/splitt/ExpenseSplittView.js';
import noteView from './subforms/note/ExpenseNoteView.js';

class ExpenseFormView {
  // --------
  // GLOBAL
  // --------

  // Global: Render

  render = data => {
    const { amount: expenseAmount } = data;
    mainView.render(data);
    paidByView.render({ ...data.paidBy, expenseAmount });
    splittView.render({ ...data.splitt, expenseAmount });
    noteView.render(data.note, data.noteCount);
  };

  // Global: Getters

  getHiddenFormToggleElements = () => {
    const { buttonPaidBy, buttonSplitt, buttonNote } =
      mainView.getHiddenFormButtons();
    const formPaidBy = paidByView.form;
    const formSplitt = splittView.form;
    const formNote = noteView.form;

    const paidByElements = {
      type: EXPENSE_HIDDEN_FORM_PAID_BY,
      form: formPaidBy,
      button: buttonPaidBy,
    };
    const splittElements = {
      type: EXPENSE_HIDDEN_FORM_SPLITT,
      form: formSplitt,
      button: buttonSplitt,
    };
    const noteElements = {
      type: EXPENSE_HIDDEN_FORM_NOTE,
      form: formNote,
      button: buttonNote,
    };

    return [paidByElements, splittElements, noteElements];
  };

  // -----------
  // MAIN FORM
  // -----------

  // Main Form: Render

  renderSubmitButton = isFormValid => {
    mainView.renderSubmitButton(isFormValid);
  };

  // Main Form: Utilities

  activate = () => {
    mainView.activate();
  };

  deactivate = () => {
    mainView.deactivate();
  };

  alignForm = () => {
    mainView.alignForm();
  };

  // Main Form: Getters

  getForm = () => {
    return mainView.form;
  };

  isActive = () => {
    return mainView.isActive();
  };

  // Main Form: Add Handlers

  addHandlerNoteButtonClick = handler => {
    mainView.addHandlerNoteButtonClick(handler);
  };

  addHandlerCloseButtonClick = handler => {
    mainView.addHandlerCloseButtonClick(handler);
  };

  // -------
  // TITLE
  // -------

  // Title: Render

  renderAfterUpdateTitle = data => {
    const { title, isValid } = data;
    mainView.renderTitle(title);
    mainView.renderSubmitButton(isValid);
  };

  // Amount: Add Handlers

  addHandlerTitleInput = handler => {
    mainView.addHandlerTitleInput(handler);
  };

  // --------
  // AMOUNT
  // --------

  // Amount: Render

  renderAmountInput = data => {
    mainView.renderAmountInput(data);
  };

  adjustAmountInputCursor = data => {
    mainView.adjustAmountInputCursor(data);
  };

  renderAfterUpdateAmount = response => {
    const {
      amount: expenseAmount,
      isValid,
      balance,
      paidBy,
      splitt,
      inputAmount,
      cursorPosition,
    } = response;

    mainView.renderAmountInput({
      processedAmount: expenseAmount,
      amountIn: inputAmount,
      cursorPosition,
    });
    mainView.renderPaidByButtonCaption({
      type: paidBy.type,
      name: paidBy.name,
    });
    paidByView.renderAfterExpenseAmountChange({
      ...paidBy,
      expenseAmount,
    });
    splittView.render({ ...splitt, expenseAmount });
    mainView.renderBalance(balance);
    mainView.renderSubmitButton(isValid);
    //
    // потом: renderEditFormElements
  };

  // Amount: Add Handlers

  addHandlerAmountInput = handler => {
    mainView.addHandlerAmountInput(handler);
  };

  addHandlerAmountInputClick = handler => {
    mainView.addHandlerAmountInputClick(handler);
  };

  // -------
  // DATE
  // -------

  // Date: Render

  renderDate = date => {
    mainView.renderDate(date);
  };

  updateDateInput = dateInputData => {
    mainView.updateDateInput(dateInputData);
  };

  // Date: Add Handlers

  addHandlerDateInput = handler => {
    mainView.addHandlerDateInput(handler);
  };

  // -------
  // EMOJI
  // -------

  // Emoji: Render

  renderEmoji = emoji => {
    mainView.renderEmoji(emoji);
  };

  // Emoji: Getters

  getEmojiField = () => {
    return mainView.getEmojiField();
  };

  getEmojiTopMarginData = () => {
    return mainView.getEmojiTopMarginData();
  };

  // Emoji: Add Handlers

  addHandlerEmojiPickerSwitchBtnClick = handler => {
    mainView.addHandlerEmojiPickerSwitchBtnClick(handler);
  };

  addHandlerEmojiInputFieldClick = handler => {
    mainView.addHandlerEmojiInputFieldClick(handler);
  };

  addHandlerEmojiDefaultBtnClick = handler => {
    mainView.addHandlerEmojiDefaultBtnClick(handler);
  };

  addHandlerEmojiRemoveBtnClick = handler => {
    mainView.addHandlerEmojiRemoveBtnClick(handler);
  };

  // ---------------
  // HIDDEN FORMS
  // ---------------

  // Hidden Forms: Add Handlers

  addHandlerCloseHiddenFormButtonClick = handler => {
    paidByView.addHandlerCloseButtonClick(handler);
    splittView.addHandlerCloseButtonClick(handler);
    noteView.addHandlerButtonCloseClick(handler);
  };

  // ---------
  // PAID BY
  // ---------

  // Paid By Form: Add Handlers

  addHandlerPaidByButtonClick = handler => {
    mainView.addHandlerPaidByButtonClick(handler);
  };

  addHandlerPaidByTableClick = handler => {
    paidByView.addHandlerTableClick(handler);
  };

  addHandlerPaidByTableChange = handler => {
    paidByView.addHandlerTableChange(handler);
  };

  addHandlerPaidByTableInput = handler => {
    paidByView.addHandlerTableInput(handler);
  };

  // TODO! удалить (возможно)
  addHandlerPayerAvatarClick = handler => {
    paidByView.addHandlerPayerAvatarClick(handler);
  };

  // TODO! удалить (возможно)
  addHandlerPayerSwitch = handler => {
    paidByView.addHandlerPayerSwitch(handler);
  };

  // TODO! удалить (возможно)
  addHandlerPayerButton = handler => {
    paidByView.addHandlerPayerButton(handler);
  };

  // --------
  // SPLITT
  // --------

  // Splitt: Render

  renderAfterUpdateSplittOption = data => {
    const { splitt, balance, expenseAmount, isValid } = data;
    mainView.renderSplittButtonCaption(splitt.type);
    mainView.renderBalance(balance);
    mainView.renderSubmitButton(isValid);
    splittView.render({ ...splitt, expenseAmount });
  };

  // Splitt: Load

  loadAddFormSetupData = data => {
    splittView.loadUsers(data);
  };

  // Splitt: Add Handlers

  addHandlerSplittButtonClick = handler => {
    mainView.addHandlerSplittButtonClick(handler);
  };

  addHandlerSplittOptionButtonClick = handler => {
    splittView.addHandlerOptionButtonClick(handler);
  };

  // ------
  // NOTE
  // ------

  // Note: Render

  renderAfterUpdateNote = response => {
    const { isEmpty, count, shouldClear } = response;
    mainView.renderNoteButtonCaption(isEmpty);
    noteView.renderNoteInputResponse({ count, shouldClear });
  };

  renderNoteCount = count => {
    noteView.renderCount(count);
  };

  // Note: Add Handlers

  addHandlerNoteInput = handler => {
    noteView.addHandlerNoteInput(handler);
  };

  addHandlerNoteInputCount = handler => {
    noteView.addHandlerNoteInputCount(handler);
  };
}

export default new ExpenseFormView();
