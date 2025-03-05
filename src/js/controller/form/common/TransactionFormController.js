import eventBus from '../../../util/EventBus.js';
import modalView from '../../../view/page/ModalView.js';

class TransactionFormController {
  _model;
  _view;
  _hiddenFormMediator;
  _modalId;

  constructor(config) {
    const { model, view, hiddenFormMediator, modalId } = config;
    this._model = model;
    this._view = view;
    this._hiddenFormMediator = hiddenFormMediator;
    this._modalId = modalId;
  }

  initSuper = () => {
    this._model.init();
    this.#loadData();
    this.#bindEventHandlers();
  };

  // Init: Load Data

  #loadData = () => {
    this.#loadEmojiField();
    this.#registerForm();
  };

  #loadEmojiField = () => {
    const emojiField = this._view.getEmojiField();
    eventBus.emit('registerEmojiField', emojiField);
  };

  #registerForm = () => {
    const formElement = this._view.getForm();
    modalView.registerModal(this._modalId, formElement);
  };

  // Init: Bind Event Handlers

  #bindEventHandlers = () => {
    this.#bindEmojiEventHandlers();
  };

  #bindEmojiEventHandlers = () => {
    this._view.addHandlerEmojiPickerSwitchBtnClick(this.#toggleEmojiPicker);
    this._view.addHandlerEmojiInputFieldClick(this.#toggleEmojiPicker);
    this._view.addHandlerEmojiDefaultBtnClick(this.#restoreDefaultEmoji);
    this._view.addHandlerEmojiRemoveBtnClick(this.#removeEmoji);
  };

  // Toggle Form

  _closeForm = () => {
    eventBus.emit('closeActiveModal');
    this._model.deactivateEmojiField();
  };

  // Toggle Hidden Form

  _toggleHiddenForm = (event, formType) => {
    event.preventDefault();
    const activeHiddenFormType = this._model.getActiveHiddenForm();
    if (activeHiddenFormType !== formType) {
      this._openHiddenForm(formType, activeHiddenFormType);
    } else {
      this._hiddenFormMediator.closeForm(activeHiddenFormType);
      this._model.updateActiveHiddenForm(null);
    }
  };

  _openHiddenForm = (newFormType, activeFormType) => {
    if (activeFormType && newFormType !== activeFormType) {
      this._hiddenFormMediator.closeForm(activeFormType);
    }
    this._hiddenFormMediator.openForm(newFormType);
    this._model.updateActiveHiddenForm(newFormType);
  };

  _closeHiddenForm = () => {
    const activeHiddenFormType = this._model.getActiveHiddenForm();
    if (!activeHiddenFormType) return;
    this._hiddenFormMediator.closeForm(activeHiddenFormType);
    this._model.updateActiveHiddenForm(null);
  };

  toggleHiddenFormOnLoad = hiddenForm => {
    if (hiddenForm) {
      this._hiddenFormMediator.openForm(hiddenForm);
    } else {
      this._hiddenFormMediator.closeAll();
    }
  };

  // Amount

  _handleAmountInputClick = event => {
    const inputValue = event.target.value;
    const cursorPosition = event.target.selectionStart;
    this._view.adjustAmountInputCursor({ inputValue, cursorPosition });
  };

  // Date

  updateDateInputRange = () => {
    const dateInputData = this._model.getDateInputUpdateData();
    this._view.updateDateInput(dateInputData);
  };

  // Emoji

  _activateEmojiField = () => {
    this._model.activateEmojiField();
    eventBus.emit('alignEmojiContainer');
  };

  #toggleEmojiPicker = event => {
    eventBus.emit('emojiPickerToggle');
    event.stopPropagation();
  };

  #restoreDefaultEmoji = defaultEmoji => {
    eventBus.emit('emojiRestoreDefault', defaultEmoji);
  };

  #removeEmoji = () => {
    eventBus.emit('emojiRemove');
  };

  // Alignment

  alignForm() {
    const isActiveForm = this._view.isActive();
    this._view.activate();

    this._view.alignForm();
    const emojiTopMarginData = this._view.getEmojiTopMarginData();
    eventBus.emit('setEmojiTopMargin', emojiTopMarginData);

    if (!isActiveForm) this._view.deactivate();
  }
}

export default TransactionFormController;
