import {
  MODAL_ID_EXPENSE,
  EXPENSE_HIDDEN_FORM_PAID_BY,
  EXPENSE_HIDDEN_FORM_SPLITT,
  EXPENSE_HIDDEN_FORM_NOTE,
  TYPE_EXPENSE,
} from '../../../util/Config.js';
import addButtonView from '../../../view/forms/expense/AddExpenseButtonView.js';
import formView from '../../../view/forms/expense/ExpenseFormView.js';
import expenseModel from '../../../model/form/expense/ExpenseModel.js';
import TransactionFormController from '../common/TransactionFormController.js';
import ExpensePaidByHandler from './ExpensePaidByHandler.js';
import ExpenseSplittHandler from './ExpenseSplittHandler.js';
import HiddenFormMediator from '../../../view/util/HiddenFormMediator.js';
import eventBus from '../../../util/EventBus.js';

class ExpenseController extends TransactionFormController {
  #paidByHandler;
  #splittHandler;

  constructor() {
    super({
      model: expenseModel,
      view: formView,
      hiddenFormMediator: new HiddenFormMediator(TYPE_EXPENSE),
      modalId: MODAL_ID_EXPENSE,
    });

    this.#paidByHandler = new ExpensePaidByHandler({
      controller: this,
      selectors: formView.getSelectors().paidBy,
    });

    this.#splittHandler = new ExpenseSplittHandler({
      controller: this,
      selectors: formView.getSelectors().splitt,
    });
  }

  init = () => {
    this.initSuper();
    this.#loadData();
    this.#bindEventHandlers();
  };

  // Load Data

  #loadData = () => {
    this.#loadAddFormSetupData();
    this.#loadHiddenForms();
    this.updateDateInputRange();
  };

  #loadAddFormSetupData = () => {
    const data = expenseModel.getAddFormSetupData();
    formView.loadAddFormSetupData(data);
  };

  #loadHiddenForms = () => {
    const hiddenFormElements = formView.getHiddenFormToggleElements();
    hiddenFormElements.forEach(hiddenForm => {
      const { type, form, button } = hiddenForm;
      this._hiddenFormMediator.registerFormButtonPair(type, form, button);
    });
  };

  // Bind Event Handlers

  #bindEventHandlers = () => {
    addButtonView.addHandlerClick(this.#openAddForm);
    this.#bindMainFormHandlers();
    this.#bindHiddenFormHandlers();
    this.#bindPaidByFormHandlers();
    this.#bindSplittFormHandlers();
    this.#bindNoteFormHandlers();
  };

  #bindMainFormHandlers = () => {
    formView.addHandlerTitleInput(this.#handleTitleInput);
    formView.addHandlerAmountInput(this.#handleAmountInput);
    formView.addHandlerAmountInputClick(this._handleAmountInputClick);
    formView.addHandlerDateInput(this.#handleDateInput);
    formView.addHandlerPaidByButtonClick(event => {
      this._toggleHiddenForm(event, EXPENSE_HIDDEN_FORM_PAID_BY);
    });
    formView.addHandlerSplittButtonClick(event => {
      this._toggleHiddenForm(event, EXPENSE_HIDDEN_FORM_SPLITT);
    });
    formView.addHandlerNoteButtonClick(event => {
      this._toggleHiddenForm(event, EXPENSE_HIDDEN_FORM_NOTE);
    });
    formView.addHandlerCloseButtonClick(this._closeForm);
  };

  #bindHiddenFormHandlers = () => {
    formView.addHandlerCloseHiddenFormButtonClick(this._closeHiddenForm);
  };

  #bindPaidByFormHandlers = () => {
    formView.addHandlerPaidByTableClick(this.#handlePaidByTableClick);
    formView.addHandlerPaidByTableChange(this.#handlePaidByTableChange);
    formView.addHandlerPaidByTableInput(this.#handlePaidByTableInput);
  };

  #bindSplittFormHandlers = () => {
    formView.addHandlerSplittOptionButtonClick(this.#handleSplittOptionChange);
    formView.addHandlerSplittTableClick(this.#handleSplittTableClick);
    formView.addHandlerSplittTableInput(this.#handleSplittTableInput);
  };

  #bindNoteFormHandlers = () => {
    formView.addHandlerNoteInput(this.#handleNoteInput);
    formView.addHandlerNoteInputCount(this.#handleNoteInputCount);
  };

  // Toggle Form

  #openAddForm = () => {
    const viewModel = expenseModel.prepareAddForm();
    this.#openForm(viewModel);
  };

  #openForm = viewModel => {
    this._activateEmojiField();
    this.#renderViewModel(viewModel);
    eventBus.emit('openModal', MODAL_ID_EXPENSE);
  };

  #renderViewModel = viewModel => {
    if (!viewModel.shouldRender) return;
    formView.render(viewModel);
    this.toggleHiddenFormOnLoad(viewModel.activeHiddenForm);
  };

  // Handlers: Main Form

  #handleTitleInput = event => {
    const inputTitle = event.target.value;
    const response = expenseModel.updateTitle(inputTitle);
    formView.renderAfterUpdateTitle(response);
  };

  #handleAmountInput = event => {
    const inputAmount = event.target.value;
    const cursorPosition = event.target.selectionStart;
    const response = expenseModel.updateAmount(inputAmount);
    formView.renderAfterUpdateAmount({
      ...response,
      inputAmount,
      cursorPosition,
    });
  };

  #handleDateInput = event => {
    const dateInput = event.target.value;
    expenseModel.updateDate(dateInput);
  };

  // Handlers: Main Form (Emoji)

  handleEmojiEdit = response => {};

  // Handlers: Reset

  // Handlers: Paid By Form

  #handlePaidByTableClick = event => {
    this.#paidByHandler.handleTableClick(event);
  };

  #handlePaidByTableChange = event => {
    this.#paidByHandler.handleTableChange(event);
  };

  #handlePaidByTableInput = event => {
    this.#paidByHandler.handleTableInput(event);
  };

  handlePayerUpdate = (entryId, newPayerId) => {
    const response = expenseModel.updatePayer(entryId, newPayerId);
    formView.renderAfterUpdatePayer(response);
  };

  handlePayerAmountInput = (entryId, inputAmount, cursorPosition) => {
    const response = expenseModel.updatePayerAmount(entryId, inputAmount);
    formView.renderAfterUpdatePayerAmount({
      ...response,
      inputAmount,
      cursorPosition,
    });
  };

  handlePayerAvatarClick = entryId => {
    formView.renderAfterPayerAvatarClick(entryId);
  };

  handleAddPayerRow = () => {
    const response = expenseModel.addPaidByEntry();
    if (!response.shouldRender) return;
    formView.renderAfterAddPayerRow(response);
  };

  handleRemovePayerRow = entryId => {
    const response = expenseModel.removePaidByEntry(entryId);
    if (!response.shouldRender) return;
    formView.renderAfterRemovePayerRow(response);
  };

  // Handlers: Splitt Form

  #handleSplittOptionChange = splittType => {
    const response = expenseModel.updateSplittType(splittType);
    if (!response.shouldRender) return;
    formView.renderAfterUpdateSplittOption(response);
  };

  #handleSplittTableClick = event => {
    this.#splittHandler.handleTableClick(event);
  };

  #handleSplittTableInput = event => {
    this.#splittHandler.handleTableInput(event);
  };

  handleSplittUpdate = inputData => {
    const { splittType, userId, inputValue, cursorPosition } = inputData;
    const response = expenseModel.updateSplitt(splittType, userId, inputValue);
    formView.renderAfterUpdateSplitt({
      ...response,
      userId,
      inputValue,
      cursorPosition,
    });
  };

  handleSplittRowClick = (type, userId) => {
    formView.renderAfterSplittRowClick(type, userId);
  };

  // Handlers: Note Form

  #handleNoteInput = event => {
    const input = event.target.value;
    const response = expenseModel.updateNote(input);

    if (response.isAboveLimit) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    formView.renderAfterUpdateNote(response);
  };

  #handleNoteInputCount = event => {
    const count = event.target.value.length;
    formView.renderNoteCount(count);
  };
}

export default new ExpenseController();
