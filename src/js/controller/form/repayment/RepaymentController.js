import addButtonView from '../../../view/forms/repayment/AddRepaymentButtonView.js';
import formView from '../../../view/forms/repayment/RepaymentFormView.js';
import noteFormView from '../../../view/forms/repayment/RepaymentNoteView.js';
import repaymentModel from '../../../model/form/repayment/RepaymentModel.js';
import HiddenFormMediator from '../../../view/util/HiddenFormMediator.js';
import {
  TYPE_REPAYMENT,
  REPAYMENT_HIDDEN_FORM_NOTE,
  MODAL_ID_REPAYMENT,
  REPAYMENT_FORM_EDIT,
} from '../../../util/Config.js';
import TransactionFormController from '../common/TransactionFormController.js';
import eventBus from '../../../util/EventBus.js';

class RepaymentController extends TransactionFormController {
  constructor() {
    super({
      model: repaymentModel,
      view: formView,
      hiddenFormMediator: new HiddenFormMediator(TYPE_REPAYMENT),
      modalId: MODAL_ID_REPAYMENT,
    });
  }

  init = () => {
    this.initSuper();
    this.#loadData();
    this.#bindEventHandlers();
  };

  // Load Data

  #loadData = () => {
    this.#loadOptions();
    this.#loadNoteForm();
    this.updateDateInputRange();
  };

  #loadOptions = () => {
    const optionsData = repaymentModel.getUserSelectOptions();
    formView.loadOptions(optionsData);
  };

  #loadNoteForm = () => {
    const form = noteFormView.form;
    const button = formView.buttonNote;
    this._hiddenFormMediator.registerFormButtonPair(
      REPAYMENT_HIDDEN_FORM_NOTE,
      form,
      button
    );
  };

  // Bind Event Handlers

  #bindEventHandlers = () => {
    addButtonView.addHandlerClick(this.#openAddForm);
    this.#bindMainFormEventHandlers();
    this.#bindResetEventHandlers();
    this.#bindNoteFormEventHandlers();
  };

  #bindMainFormEventHandlers = () => {
    formView.addHandlerPayerChange(this.#handlePartyChange);
    formView.addHandlerRecipientChange(event =>
      this.#handlePartyChange(event, false)
    );
    formView.addHandlerAmountInput(this.#handleAmountInput);
    formView.addHandlerAmountInputClick(this._handleAmountInputClick);
    formView.addHandlerDateInput(this.#handleDateInput);
    formView.addHandlerNoteButtonClick(event => {
      this._toggleHiddenForm(event, REPAYMENT_HIDDEN_FORM_NOTE);
    });
    formView.addHandlerCloseButtonClick(this._closeForm);
    formView.addHandlerSubmitButtonClick(this.#handleSubmitForm);
  };

  #bindResetEventHandlers = () => {
    formView.addHandlerResetAll(this.#handleResetAll);
    formView.addHandlerResetAmount(this.#handleResetAmount);
    formView.addHandlerResetDate(this.#handleResetDate);
    formView.addHandlerResetPayer(this.#handleResetPayer);
    formView.addHandlerResetRecipient(this.#handleResetRecipient);
    formView.addHandlerResetEmoji(this.#handleResetEmoji);
    formView.addHandlerResetNote(this.#handleResetNote);
    noteFormView.addHandlerReset(this.#handleResetNote);
  };

  #bindNoteFormEventHandlers = () => {
    noteFormView.addHandlerButtonCloseClick(this._closeHiddenForm);
    noteFormView.addHandlerNoteInput(this.#handleNoteInput);
    noteFormView.addHandlerNoteInputCount(this.#handleNoteInputCount);
  };

  // Toggle Form

  #openAddForm = () => {
    const viewModel = repaymentModel.prepareAddForm();
    this.#openForm(viewModel);
  };

  openSettleForm = selectedUserId => {
    const viewModel = repaymentModel.prepareSettleForm(selectedUserId);
    this.#openForm(viewModel);
  };

  openEditForm = async repaymentId => {
    if (!repaymentId) return;
    const viewModel = await repaymentModel.prepareEditForm(repaymentId);
    this.#openForm(viewModel);
  };

  #openForm = viewModel => {
    this._activateEmojiField();
    this.#renderViewModel(viewModel);
    eventBus.emit('openModal', MODAL_ID_REPAYMENT);
  };

  #renderViewModel = viewModel => {
    if (!viewModel.shouldRender) return;
    this.#cleanupForm(viewModel.shouldCleanup);
    formView.render(viewModel);
    noteFormView.render(viewModel.note, viewModel.noteCount);
    this.toggleHiddenFormOnLoad(viewModel.activeHiddenForm);
  };

  #cleanupForm = shouldCleanup => {
    if (!shouldCleanup) return;
    formView.hideEditFormElements();
    noteFormView.renderResetButtonVisibility(false);
  };

  // Handlers: Submit Form

  #handleSubmitForm = () => {
    this._closeForm();
    eventBus.emit('demoTransactionSubmitted');
    const viewModel = repaymentModel.resetForm();
    this.#renderViewModel(viewModel);
  };

  // Handlers: Main Form

  #handlePartyChange = (event, isPayer = true) => {
    const userId = event.target.value;
    const response = repaymentModel.updateParty(userId, isPayer);
    formView.renderSubmitButton(response.isFormValid);
    if (response.formType === REPAYMENT_FORM_EDIT) {
      const fieldName = isPayer ? 'payer' : 'recipient';
      formView.renderEditFormElements(fieldName, response);
    }
  };

  #handleAmountInput = event => {
    const inputAmount = event.target.value;
    const cursorPosition = event.target.selectionStart;

    const response = repaymentModel.updateAmount(inputAmount);

    formView.renderAmountInput({
      processedAmount: response.amount,
      amountIn: inputAmount,
      cursorPosition,
    });
    formView.renderSubmitButton(response.isFormValid);
    if (response.formType === REPAYMENT_FORM_EDIT) {
      formView.renderEditFormElements('amount', response);
    }
  };

  #handleDateInput = event => {
    const dateInput = event.target.value;
    const response = repaymentModel.updateDate(dateInput);
    if (response.formType === REPAYMENT_FORM_EDIT) {
      formView.renderEditFormElements('date', response);
      formView.renderSubmitButton(response.isFormValid);
    }
  };

  handleEmojiEdit = response => {
    formView.renderEditFormElements('emoji', response);
    formView.renderSubmitButton(response.isFormValid);
  };

  // Handlers: Reset

  #handleResetAll = () => {
    const response = repaymentModel.resetAll();
    formView.render(response);
    formView.hideEditFormElements();
    noteFormView.render(response.note, response.noteCount);
    noteFormView.renderResetButtonVisibility(false);
  };

  #handleResetAmount = () => {
    const response = repaymentModel.resetAmount();
    formView.renderAmountInput({ processedAmount: response.amount });
    this.#resetFormButtons('amount', response);
  };

  #handleResetPayer = () => {
    const response = repaymentModel.resetPayer();
    formView.renderPayer(response.payer);
    this.#resetFormButtons('payer', response);
  };

  #handleResetRecipient = () => {
    const response = repaymentModel.resetRecipient();
    formView.renderRecipient(response.recipient);
    this.#resetFormButtons('recipient', response);
  };

  #handleResetDate = () => {
    const response = repaymentModel.resetDate();
    formView.renderDate(response.date);
    this.#resetFormButtons('date', response);
  };

  #handleResetEmoji = () => {
    const response = repaymentModel.resetEmoji();
    formView.renderEmoji(response.emoji);
    this.#resetFormButtons('emoji', response);
  };

  #handleResetNote = () => {
    const response = repaymentModel.resetNote();
    formView.renderNoteButtonCaption(!response.note);
    this.#resetFormButtons('note', response);
    noteFormView.render(response.note, response.count);
    noteFormView.renderResetButtonVisibility(false);
  };

  #resetFormButtons = (fieldName, settings) => {
    formView.renderEditFormElements(fieldName, settings);
    formView.renderSubmitButton(settings.isFormValid);
  };

  // Handlers: Hidden Form

  #handleNoteInput = event => {
    const input = event.target.value;

    const response = repaymentModel.updateNote(input);

    if (response.isAboveLimit) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    noteFormView.renderNoteInputResponse({
      count: response.count,
      shouldClear: response.shouldClear,
    });

    formView.renderNoteButtonCaption(response.isEmpty);
    if (response.formType === REPAYMENT_FORM_EDIT) {
      formView.renderEditFormElements('note', response);
      formView.renderSubmitButton(response.isFormValid);
      noteFormView.renderResetButtonVisibility(response.isFieldEdited);
    }
  };

  #handleNoteInputCount = event => {
    const count = event.target.value.length;
    noteFormView.renderCount(count);
  };
}

export default new RepaymentController();
