import {
  ACTIVE_CLASS,
  DISABLED_ATTRIBUTE,
  REPAYMENT_FORM_EDIT,
  DEFAULT_EMOJI_REPAYMENT,
  TYPE_REPAYMENT,
  DEFAULT_CLASS,
  INVISIBLE_CLASS,
} from '../../util/Config.js';
import {
  formatAmountForOutput,
  setAmountCursorPosition,
  setAmountCursorOnClick,
  activateHTMLElement,
  deactivateHTMLElement,
  toggleEmojiInputField,
  renderResetButton,
  isActiveHTMLElement,
} from '../util/RenderHelper.js';
import alignmentHelper from '../util/AlignmentHelper.js';

class RepaymentFormView {
  #headerAddCaption = 'Вернуть долг';
  #headerEditCaption = 'Редактировать';
  #currentUserPayerCaption = 'от вас';
  #currentUserRecipientCaption = 'вам';
  #buttonNoteCaptionEmpty = 'написать';
  #buttonNoteCaption = 'редактировать';
  #submitAddCaption = 'добавить';
  #submitEditCaption = 'сохранить';
  #form;
  #mainForm;
  #hiddenForms;
  #header;
  #inputAmount;
  #inputDate;
  #switchPayer;
  #switchRecipient;
  #buttonNote;
  #buttonClose;
  #buttonSubmit;
  #emojiRow;
  #emojiInputField;
  #emojiDefaultBtn;
  #emojiPickerSwitchBtn;
  #emojiRemoveBtn;
  #resetBtn;
  #resetAmountBtn;
  #resetDateBtn;
  #resetEmojiBtn;
  #resetPayerBtn;
  #resetRecipientBtn;
  #resetNoteBtn;
  #resetButtons = new Map();

  constructor() {
    this.#hiddenForms = document.querySelectorAll(
      '.add-repayment__form-hidden'
    );
    this.#parseFormElements();
    this.#parseEmojiElements();
    this.#parseResetButtons();
  }

  #parseFormElements = () => {
    this.#form = document.querySelector('.add-repayment__form');
    this.#mainForm = document.querySelector('.add-repayment__form_main');
    this.#header = document.querySelector('.add-repayment__form_header_text');
    this.#inputAmount = document.querySelector('.add-repayment-amount');
    this.#inputDate = document.querySelector('.add-repayment-date');
    this.#switchPayer = document.getElementById('add-repayment__switch-from');
    this.#switchRecipient = document.getElementById('add-repayment__switch-to');
    this.#buttonNote = document.querySelector(
      '.add-repayment__btn-edit.hidden-form-btn__note'
    );
    this.#buttonClose = document.querySelector('.add-repayment__btn--close');
    this.#buttonSubmit = document.querySelector('.add-repayment__btn--submit');
  };

  #parseEmojiElements = () => {
    this.#emojiRow = document.querySelector('.add-repayment-emoji-row');
    this.#emojiInputField = document.querySelector(
      '.emoji-input.add-repayment'
    );
    this.#emojiDefaultBtn = document.querySelector(
      '.btn__emoji-restore-default.add-repayment'
    );
    this.#emojiPickerSwitchBtn = document.querySelector(
      '.btn__emoji-picker--switch.add-repayment'
    );
    this.#emojiRemoveBtn = document.querySelector(
      '.btn__emoji-remove.add-repayment'
    );
  };

  #parseResetButtons = () => {
    this.#resetBtn = document.querySelector('.reset-repayment');
    this.#resetAmountBtn = document.querySelector('.reset-repayment-amount');
    this.#resetDateBtn = document.querySelector('.reset-repayment-date');
    this.#resetEmojiBtn = document.querySelector('.reset-repayment-emoji');
    this.#resetPayerBtn = document.querySelector('.reset-repayment-payer');
    this.#resetRecipientBtn = document.querySelector(
      '.reset-repayment-recipient'
    );
    this.#resetNoteBtn = document.querySelector('.reset-repayment-note');

    this.#resetButtons.set('form', this.#resetBtn);
    this.#resetButtons.set('amount', this.#resetAmountBtn);
    this.#resetButtons.set('date', this.#resetDateBtn);
    this.#resetButtons.set('emoji', this.#resetEmojiBtn);
    this.#resetButtons.set('payer', this.#resetPayerBtn);
    this.#resetButtons.set('recipient', this.#resetRecipientBtn);
    this.#resetButtons.set('note', this.#resetNoteBtn);
  };

  // ADD HANDLERS

  addHandlerAmountInput = handler => {
    this.#inputAmount.addEventListener('input', handler);
  };

  addHandlerAmountInputClick = handler => {
    this.#inputAmount.addEventListener('click', handler);
  };

  addHandlerDateInput = handler => {
    this.#inputDate.addEventListener('input', handler);
  };

  addHandlerPayerChange = handler => {
    this.#switchPayer.addEventListener('change', handler);
  };

  addHandlerRecipientChange = handler => {
    this.#switchRecipient.addEventListener('change', handler);
  };

  addHandlerNoteButtonClick = handler => {
    this.#buttonNote.addEventListener('click', handler);
  };

  addHandlerCloseButtonClick = handler => {
    this.#buttonClose.addEventListener('click', handler);
  };

  // ADD HANDLERS (Emoji)

  addHandlerEmojiPickerSwitchBtnClick = handler => {
    this.#emojiPickerSwitchBtn.addEventListener('click', handler);
  };

  addHandlerEmojiInputFieldClick = handler => {
    this.#emojiInputField.addEventListener('click', handler);
  };

  addHandlerEmojiDefaultBtnClick = handler => {
    this.#emojiDefaultBtn.addEventListener('click', () =>
      handler(DEFAULT_EMOJI_REPAYMENT)
    );
  };

  addHandlerEmojiRemoveBtnClick = handler => {
    this.#emojiRemoveBtn.addEventListener('click', handler);
  };

  // ADD HANDLERS (Reset)

  addHandlerResetAll = handler => {
    this.#resetBtn.addEventListener('click', handler);
  };

  addHandlerResetAmount = handler => {
    this.#resetAmountBtn.addEventListener('click', handler);
  };

  addHandlerResetPayer = handler => {
    this.#resetPayerBtn.addEventListener('click', handler);
  };

  addHandlerResetRecipient = handler => {
    this.#resetRecipientBtn.addEventListener('click', handler);
  };

  addHandlerResetDate = handler => {
    this.#resetDateBtn.addEventListener('click', handler);
  };

  addHandlerResetEmoji = handler => {
    this.#resetEmojiBtn.addEventListener('click', handler);
  };

  addHandlerResetNote = handler => {
    this.#resetNoteBtn.addEventListener('click', handler);
  };

  // LOAD

  /**
   * Loads options into the <select> elements for payer (#switchPayer) and recipient (#switchRecipient).
   *
   * @param {Object} data - The data object containing the current user ID and members list.
   * @param {BigInt} data.currentUserId - The ID of the current user.
   * @param {Array<Object>} data.members - The array of member objects, where each object has:
   *  - {BigInt} id - The ID of the member.
   *  - {string} name - The name of the member.
   */
  loadOptions = ({ currentUserId, members }) => {
    members.forEach(member => {
      const payerOption = this.#createSelectOption(member, currentUserId);
      const recipientOption = this.#createSelectOption(
        member,
        currentUserId,
        false
      );
      this.#switchPayer.appendChild(payerOption);
      this.#switchRecipient.appendChild(recipientOption);
    });
  };

  /**
   * Creates an <option> element for <select> elements: #switchPayer and #switchRecipient.
   *
   * @param {Object} user - The user object containing the user's details.
   * @param {BigInt} user.id - The ID of the user.
   * @param {string} user.name - The name of the user.
   * @param {BigInt} currentUserId - The ID of the current user.
   * @param {boolean} [isPayer=true] - A flag indicating if the option is for the payer (default is true).
   * @returns {HTMLOptionElement} - The created <option> element.
   */
  #createSelectOption = (user, currentUserId, isPayer = true) => {
    const option = document.createElement('option');
    option.value = user.id;
    if (user.id === currentUserId) {
      option.textContent = isPayer
        ? this.#currentUserPayerCaption
        : this.#currentUserRecipientCaption;
      return option;
    }
    option.textContent = user.name;
    return option;
  };

  // GETTERS

  get form() {
    return this.#form;
  }

  get mainForm() {
    return this.#mainForm;
  }

  get buttonNote() {
    return this.#buttonNote;
  }

  get inputAmount() {
    return this.#inputAmount;
  }

  getEmojiField = () => {
    return {
      inputField: this.#emojiInputField,
      defaultBtn: this.#emojiDefaultBtn,
      pickerSwitchBtn: this.#emojiPickerSwitchBtn,
      removeBtn: this.#emojiRemoveBtn,
      formType: TYPE_REPAYMENT,
    };
  };

  isActive = () => {
    return isActiveHTMLElement(this.#form);
  };

  // Activate / Deactivate

  activate = () => {
    activateHTMLElement(this.#form);
  };

  deactivate = () => {
    deactivateHTMLElement(this.#form);
  };

  // Render: Forms

  render = data => {
    const { type, isValid, amount, payer, recipient, note, emoji, date } = data;
    this.#renderCaptions(type);
    this.#renderAmount(amount);
    this.renderPayer(payer);
    this.renderRecipient(recipient);
    this.renderDate(date);
    this.renderEmoji(emoji);
    this.renderNoteButtonCaption(!note);
    this.renderSubmitButton(isValid);
  };

  // Render: Elements

  renderAmountInput = ({ processedAmount, amountIn, cursorPosition }) => {
    const amountOut = formatAmountForOutput(processedAmount);
    this.#inputAmount.value = amountOut;
    const inputElement = this.#inputAmount;
    if (!cursorPosition) return;
    setAmountCursorPosition({
      amountIn,
      amountOut,
      cursorPosition,
      inputElement,
    });
  };

  adjustAmountInputCursor = ({ inputValue, cursorPosition }) => {
    const inputElement = this.#inputAmount;
    setAmountCursorOnClick({ inputValue, inputElement, cursorPosition });
  };

  renderSubmitButton = isFormValid => {
    if (isFormValid) {
      this.#buttonSubmit.removeAttribute(DISABLED_ATTRIBUTE);
      this.#buttonSubmit.classList.add(ACTIVE_CLASS);
    } else {
      this.#buttonSubmit.setAttribute(DISABLED_ATTRIBUTE, DISABLED_ATTRIBUTE);
      this.#buttonSubmit.classList.remove(ACTIVE_CLASS);
    }
  };

  updateDateInput = ({ min, max, updateDefaultDate }) => {
    this.#inputDate.setAttribute('max', max);
    this.#inputDate.setAttribute('min', min);
    if (updateDefaultDate) this.#inputDate.value = max;
  };

  // Render: Edit Form

  renderEditFormElements = (fieldName, settings) => {
    const fieldResetButton = this.#resetButtons.get(fieldName);
    const { isFieldEdited, hasEdits } = settings;
    renderResetButton(fieldResetButton, isFieldEdited);
    renderResetButton(this.#resetBtn, hasEdits);
  };

  hideEditFormElements = () => {
    this.#hideResetButtons();
  };

  #hideResetButtons = () => {
    this.#resetButtons.forEach(button => {
      button.classList.add(INVISIBLE_CLASS);
    });
  };

  // Render: Private Methods

  #renderCaptions = formType => {
    if (formType === REPAYMENT_FORM_EDIT) {
      this.#renderCaptionsEdit();
    } else {
      this.#renderCaptionsAdd();
    }
  };

  #renderCaptionsAdd = () => {
    this.#header.textContent = this.#headerAddCaption;
    this.#buttonSubmit.textContent = this.#submitAddCaption;
  };

  #renderCaptionsEdit = () => {
    this.#header.textContent = this.#headerEditCaption;
    this.#buttonSubmit.textContent = this.#submitEditCaption;
  };

  #renderAmount = amount => {
    this.#inputAmount.value = formatAmountForOutput(amount);
  };

  renderPayer = payerId => {
    this.#switchPayer.value = payerId ? payerId.toString() : DEFAULT_CLASS;
  };

  renderRecipient = recipientId => {
    this.#switchRecipient.value = recipientId
      ? recipientId.toString()
      : DEFAULT_CLASS;
  };

  renderEmoji = emoji => {
    if (!emoji) {
      toggleEmojiInputField(this.getEmojiField(), false);
    }
    toggleEmojiInputField(this.getEmojiField());
    this.#emojiInputField.value = emoji;
  };

  renderDate = date => {
    this.#inputDate.value = date;
  };

  renderNoteButtonCaption = isEmpty => {
    this.#buttonNote.textContent = isEmpty
      ? this.#buttonNoteCaptionEmpty
      : this.#buttonNoteCaption;
  };

  // Alignment

  alignForm = () => {
    alignmentHelper.alignTransactionForm({
      mainForm: this.#mainForm,
      hiddenForms: this.#hiddenForms,
    });
  };

  getEmojiTopMarginData = () => {
    const topMargin = alignmentHelper.calculateEmojiTopMargin(this.#emojiRow);
    return { fieldId: TYPE_REPAYMENT, topMargin };
  };
}

export default new RepaymentFormView();
