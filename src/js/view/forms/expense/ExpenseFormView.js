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
  // Render
  render = data => {
    mainView.render(data);
    paidByView.render({ ...data.paidBy, expenseAmount: data.amount });
    splittView.render(data.splitt);
    noteView.render(data.note, data.noteCount);
  };

  renderAmountInput = data => {
    mainView.renderAmountInput(data);
  };

  adjustAmountInputCursor = data => {
    mainView.adjustAmountInputCursor(data);
  };

  renderEmoji = emoji => {
    mainView.renderEmoji(emoji);
  };

  renderDate = date => {
    mainView.renderDate(date);
  };

  renderPaidBy = data => {
    const { type, name } = data;
    mainView.renderPaidByButtonCaption({ type, name });
  };

  renderSplitt = data => {
    const { type } = data;
    mainView.renderSplittButtonCaption(type);
  };

  renderSubmitButton = isFormValid => {
    mainView.renderSubmitButton(isFormValid);
  };

  // Activate / Deactivate

  activate = () => {
    mainView.activate();
  };

  deactivate = () => {
    mainView.deactivate();
  };

  // Alignment

  alignForm = () => {
    mainView.alignForm();
  };

  // LOAD

  loadAddFormSetupData = data => {
    splittView.loadUsers(data);
  };

  updateDateInput = dateInputData => {
    mainView.updateDateInput(dateInputData);
  };

  // GETTERS

  getMainForm = () => {
    return mainView.form;
  };

  isActive = () => {
    return mainView.isActive();
  };

  getEmojiField = () => {
    return mainView.getEmojiField();
  };

  getEmojiTopMarginData = () => {
    return mainView.getEmojiTopMarginData();
  };

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

  // ADD HANDLERS

  addHandlerAmountInput = handler => {
    mainView.addHandlerAmountInput(handler);
  };

  addHandlerAmountInputClick = handler => {
    mainView.addHandlerAmountInputClick(handler);
  };

  addHandlerDateInput = handler => {
    mainView.addHandlerDateInput(handler);
  };

  addHandlerPaidByButtonClick = handler => {
    mainView.addHandlerPaidByButtonClick(handler);
  };

  addHandlerSplittButtonClick = handler => {
    mainView.addHandlerSplittButtonClick(handler);
  };

  addHandlerNoteButtonClick = handler => {
    mainView.addHandlerNoteButtonClick(handler);
  };

  addHandlerCloseButtonClick = handler => {
    mainView.addHandlerCloseButtonClick(handler);
  };

  // ADD HANDLERS (Emoji)

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

  // ADD HANDLERS (Paid By)

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
}

export default new ExpenseFormView();
