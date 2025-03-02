import {
  MODAL_ID_EXPENSE,
  EXPENSE_HIDDEN_FORM_PAID_BY,
  EXPENSE_HIDDEN_FORM_SPLITT,
  EXPENSE_HIDDEN_FORM_NOTE,
  TYPE_EXPENSE,
} from '../../util/Config.js';
import addButtonView from '../../view/forms/expense/AddExpenseButtonView.js';
import formView from '../../view/forms/expense/ExpenseFormView.js';
import modalView from '../../view/page/ModalView.js';
import expenseModel from '../../model/expense/ExpenseModel.js';
import HiddenFormMediator from '../../view/util/HiddenFormMediator.js';
import eventBus from '../../util/EventBus.js';

// TODO! удалить
import State from '../../model/state/State.js';

class ExpenseController {
  #hiddenFormMediator;

  constructor() {
    this.#hiddenFormMediator = new HiddenFormMediator(TYPE_EXPENSE);
  }

  init = () => {
    expenseModel.init();
    this.#loadData();
    this.#bindEventHandlers();
    this.#bindHiddenFormHandlers();
    this.#bindSplittFormHandlers();
    this.#bindNoteFormHandlers();

    // TODO! удалить
    // console.log(State);
  };

  // Load Data

  #loadData = () => {
    this.#loadAddFormSetupData();
    this.#loadHiddenForms();
    this.#loadEmojiField();
    this.updateDateInputRange();
    this.#registerForm();
  };

  #loadAddFormSetupData = () => {
    const data = expenseModel.getAddFormSetupData();
    formView.loadAddFormSetupData(data);
  };

  #loadEmojiField = () => {
    const emojiField = formView.getEmojiField();
    eventBus.emit('registerEmojiField', emojiField);
  };

  #loadHiddenForms = () => {
    const hiddenFormElements = formView.getHiddenFormToggleElements();
    hiddenFormElements.forEach(hiddenForm => {
      const { type, form, button } = hiddenForm;
      this.#hiddenFormMediator.registerFormButtonPair(type, form, button);
    });
  };

  #registerForm = () => {
    const formElement = formView.getMainForm();
    modalView.registerModal(MODAL_ID_EXPENSE, formElement);
  };

  // Bind Event Handlers

  #bindEventHandlers = () => {
    addButtonView.addHandlerClick(this.#openAddForm);
    this.#bindMainFormHandlers();
  };

  #bindMainFormHandlers = () => {
    formView.addHandlerTitleInput(this.#handleTitleInput);
    formView.addHandlerAmountInput(this.#handleAmountInput);
    formView.addHandlerAmountInputClick(this.#handleAmountInputClick);
    formView.addHandlerPaidByButtonClick(event => {
      this.#toggleHiddenForm(event, EXPENSE_HIDDEN_FORM_PAID_BY);
    });
    formView.addHandlerSplittButtonClick(event => {
      this.#toggleHiddenForm(event, EXPENSE_HIDDEN_FORM_SPLITT);
    });
    formView.addHandlerNoteButtonClick(event => {
      this.#toggleHiddenForm(event, EXPENSE_HIDDEN_FORM_NOTE);
    });
    formView.addHandlerCloseButtonClick(this.#closeForm);
  };

  #bindHiddenFormHandlers = () => {
    formView.addHandlerCloseHiddenFormButtonClick(this.#closeHiddenForm);
  };

  #bindSplittFormHandlers = () => {
    formView.addHandlerSplittOptionButtonClick(this.#handleSplittOptionChange);
  };

  #bindNoteFormHandlers = () => {
    formView.addHandlerNoteInput(this.#handleNoteInput);
    formView.addHandlerNoteInputCount(this.#handleNoteInputCount);
  };

  // Toggle Form

  // TODO! удалить потом
  openSplittForm = () => {
    this.#openAddForm();
    this.#openHiddenForm(EXPENSE_HIDDEN_FORM_SPLITT, null);
  };

  // TODO! удалить потом
  openPaidByForm = () => {
    this.#openAddForm();
    this.#openHiddenForm(EXPENSE_HIDDEN_FORM_PAID_BY, null);
  };

  #openAddForm = () => {
    const viewModel = expenseModel.prepareAddForm();
    this.#openForm(viewModel);
  };

  #openForm = viewModel => {
    this.#activateEmojiField();
    this.#renderViewModel(viewModel);
    eventBus.emit('openModal', MODAL_ID_EXPENSE);
  };

  #renderViewModel = viewModel => {
    if (!viewModel.shouldRender) return;
    // TODO! cleanUp
    formView.render(viewModel);
    this.toggleHiddenFormOnLoad(viewModel.activeHiddenForm);
  };

  #closeForm = () => {
    eventBus.emit('closeActiveModal');
    expenseModel.deactivateEmojiField();
  };

  // Toggle Hidden Forms

  #toggleHiddenForm = (event, formType) => {
    event.preventDefault();
    const activeHiddenFormType = expenseModel.getActiveHiddenForm();
    if (activeHiddenFormType !== formType) {
      this.#openHiddenForm(formType, activeHiddenFormType);
    } else {
      this.#hiddenFormMediator.closeForm(activeHiddenFormType);
      expenseModel.updateActiveHiddenForm(null);
    }
  };

  #openHiddenForm = (newFormType, activeFormType) => {
    if (activeFormType && newFormType !== activeFormType) {
      this.#hiddenFormMediator.closeForm(activeFormType);
    }
    this.#hiddenFormMediator.openForm(newFormType);
    expenseModel.updateActiveHiddenForm(newFormType);
  };

  #closeHiddenForm = event => {
    event.preventDefault();
    const activeHiddenFormType = expenseModel.getActiveHiddenForm();
    if (!activeHiddenFormType) return;
    this.#hiddenFormMediator.closeForm(activeHiddenFormType);
    expenseModel.updateActiveHiddenForm(null);
  };

  toggleHiddenFormOnLoad = hiddenForm => {
    if (hiddenForm) {
      this.#hiddenFormMediator.openForm(hiddenForm);
    } else {
      this.#hiddenFormMediator.closeAll();
    }
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

  #handleAmountInputClick = event => {
    const inputValue = event.target.value;
    const cursorPosition = event.target.selectionStart;
    formView.adjustAmountInputCursor({ inputValue, cursorPosition });
  };

  // Handlers: Main Form (Emoji)

  #activateEmojiField = () => {
    expenseModel.activateEmojiField();
    eventBus.emit('alignEmojiContainer');
  };

  // Handlers: Reset

  // Handlers: Splitt Form

  #handleSplittOptionChange = splittType => {
    const response = expenseModel.updateSplittType(splittType);
    if (!response.shouldRender) return;
    formView.renderAfterUpdateSplittOption(response);
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
    const dateInputData = expenseModel.getDateInputUpdateData();
    formView.updateDateInput(dateInputData);
  };
}

export default new ExpenseController();
