import addButtonView from '../../view/repayment/AddRepaymentButtonView.js';
import formView from '../../view/repayment/RepaymentFormView.js';
import noteFormView from '../../view/repayment/RepaymentFormNoteView.js';
import repaymentModel from '../../model/repayment/RepaymentModel.js';
import modalView from '../../view/page/ModalView.js';
import HiddenFormMediator from '../../view/util/HiddenFormMediator.js';
import {
  REPAYMENT_HIDDEN_FORM_NOTE,
  MODAL_ID_REPAYMENT,
  REPAYMENT_FORM_EDIT,
} from '../../util/Config.js';
import EventEmitter from 'events';
import eventBus from '../../util/EventBus.js';

class RepaymentController extends EventEmitter {
  #hiddenFormMediator;

  constructor() {
    super();
    this.#hiddenFormMediator = new HiddenFormMediator();
  }

  init = () => {
    repaymentModel.init();
    this.#loadData();
    this.#bindEventHandlers();
  };

  // Load Data

  #loadData = () => {
    this.#loadOptions();
    this.#loadEmojiField();
    this.#loadNoteForm();
    this.updateDateInputRange();
    this.#registerForm();
  };

  #loadOptions = () => {
    const optionsData = repaymentModel.getUserSelectOptions();
    formView.loadOptions(optionsData);
  };

  #loadEmojiField = () => {
    const emojiField = formView.getEmojiField();
    eventBus.emit('registerEmojiField', emojiField);
  };

  #loadNoteForm = () => {
    const form = noteFormView.form;
    const button = formView.buttonNote;
    this.#hiddenFormMediator.registerFormButtonPair(
      REPAYMENT_HIDDEN_FORM_NOTE,
      form,
      button
    );
  };

  #registerForm = () => {
    const formElement = formView.form;
    modalView.registerModal(MODAL_ID_REPAYMENT, formElement);
  };

  // Bind Event Handlers

  #bindEventHandlers = () => {
    addButtonView.addHandlerClick(this.#openAddForm);
    this.#bindMainFormEventHandlers();
    this.#bindEmojiEventHandlers();
    this.#bindResetEventHandlers();
    this.#bindNoteFormEventHandlers();
  };

  #bindMainFormEventHandlers = () => {
    formView.addHandlerPayerChange(this.#handlePartyChange);
    formView.addHandlerRecipientChange(event =>
      this.#handlePartyChange(event, false)
    );
    formView.addHandlerAmountInput(this.#handleAmountInput);
    formView.addHandlerAmountInputClick(this.#handleAmountInputClick);
    formView.addHandlerDateInput(this.#handleDateInput);
    formView.addHandlerNoteButtonClick(event => {
      this.#toggleHiddenForm(event, REPAYMENT_HIDDEN_FORM_NOTE);
    });
    formView.addHandlerCloseButtonClick(this.#closeForm);
  };

  #bindEmojiEventHandlers = () => {
    formView.addHandlerEmojiPickerSwitchBtnClick(this.#toggleEmojiPicker);
    formView.addHandlerEmojiInputFieldClick(this.#toggleEmojiPicker);
    formView.addHandlerEmojiDefaultBtnClick(this.#restoreDefaultEmoji);
    formView.addHandlerEmojiRemoveBtnClick(this.#removeEmoji);
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
    noteFormView.addHandlerButtonCloseClick(this.#closeHiddenForm);
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
    this.#activateEmojiField();
    this.#renderViewModel(viewModel);
    eventBus.emit('openModal', MODAL_ID_REPAYMENT);
  };

  #renderViewModel = viewModel => {
    if (!viewModel.shouldRender) return;
    formView.render(viewModel);
    noteFormView.render(viewModel.note, viewModel.noteCount);
    this.toggleHiddenFormOnLoad(viewModel.activeHiddenForm);
  };

  #closeForm = () => {
    eventBus.emit('closeActiveModal');
    repaymentModel.deactivateEmojiField();
  };

  cleanupOnFormClose = () => {
    const activeFormType = repaymentModel.getActiveFormType();
    if (activeFormType === REPAYMENT_FORM_EDIT) this.#closeEditForm();
  };

  #closeEditForm = () => {
    formView.hideEditFormElements();
    noteFormView.renderResetButtonVisibility(false);
    repaymentModel.resetHiddenForm();
  };

  // Toggle Hidden Form

  #toggleHiddenForm = (event, formType) => {
    event.preventDefault();
    const activeHiddenFormType = repaymentModel.getActiveHiddenForm();
    if (activeHiddenFormType !== formType) {
      this.#openHiddenForm(formType, activeHiddenFormType);
    } else {
      this.#hiddenFormMediator.closeForm(activeHiddenFormType);
      repaymentModel.updateActiveHiddenForm(null);
    }
  };

  #openHiddenForm = (newFormType, activeFormType) => {
    if (activeFormType && newFormType !== activeFormType) {
      this.#hiddenFormMediator.closeForm(activeFormType);
    }
    this.#hiddenFormMediator.openForm(newFormType);
    repaymentModel.updateActiveHiddenForm(newFormType);
  };

  #closeHiddenForm = () => {
    const activeHiddenFormType = repaymentModel.getActiveHiddenForm();
    if (!activeHiddenFormType) return;
    this.#hiddenFormMediator.closeForm(activeHiddenFormType);
    repaymentModel.updateActiveHiddenForm(null);
  };

  toggleHiddenFormOnLoad = hiddenForm => {
    if (hiddenForm) {
      this.#hiddenFormMediator.openForm(hiddenForm);
    } else {
      this.#hiddenFormMediator.closeAll();
    }
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

  #handleAmountInputClick = event => {
    const inputValue = event.target.value;
    const cursorPosition = event.target.selectionStart;
    formView.adjustAmountInputCursor({ inputValue, cursorPosition });
  };

  #handleDateInput = event => {
    const dateInput = event.target.value;
    const response = repaymentModel.updateDate(dateInput);
    if (response.formType === REPAYMENT_FORM_EDIT) {
      formView.renderEditFormElements('date', response);
      formView.renderSubmitButton(response.isFormValid);
    }
  };

  // Handlers: Main Form (Emoji)

  #activateEmojiField = () => {
    repaymentModel.activateEmojiField();
    this.emit('alignEmojiContainer');
  };

  #toggleEmojiPicker = event => {
    this.emit('emojiPickerToggle');
    event.stopPropagation();
  };

  #restoreDefaultEmoji = defaultEmoji => {
    this.emit('emojiRestoreDefault', defaultEmoji);
  };

  #removeEmoji = () => {
    this.emit('emojiRemove');
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

  // Alignment

  alignForm() {
    const isActiveForm = formView.isActive();
    formView.activate();

    formView.alignForm();
    const emojiTopMarginData = formView.getEmojiTopMarginData();
    eventBus.emit('setEmojiTopMargin', emojiTopMarginData);

    if (!isActiveForm) formView.deactivate();
  }

  // Update

  updateDateInputRange = () => {
    const dateInputData = repaymentModel.getDateInputUpdateData();
    formView.updateDateInput(dateInputData);
  };
}

export default new RepaymentController();
