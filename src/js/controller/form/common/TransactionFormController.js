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
}

export default TransactionFormController;
