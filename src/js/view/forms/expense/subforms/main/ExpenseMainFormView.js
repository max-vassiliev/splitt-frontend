import {
  DEFAULT_CLASS,
  DEFAULT_EMOJI_EXPENSE,
  INVISIBLE_CLASS,
  POSITIVE_CLASS,
  NEGATIVE_CLASS,
  HIDDEN_CLASS,
  EXPENSE_FORM_EDIT,
  TYPE_EXPENSE,
  EXPENSE_PAID_BY_COPAYMENT,
  EXPENSE_PAID_BY_CURRENT_USER,
  EXPENSE_PAID_BY_EMPTY,
  EXPENSE_PAID_BY_OTHER_USER,
  EXPENSE_SPLITT_EQUALLY,
  EXPENSE_SPLITT_PARTS,
  EXPENSE_SPLITT_SHARES,
  EXPENSE_BALANCE_DEFAULT,
  EXPENSE_BALANCE_CHECK_PAID_BY,
  EXPENSE_BALANCE_CHECK_SPLITT,
  EXPENSE_BALANCE_AMOUNT_BELOW_MIN,
  EXPENSE_BALANCE_AMOUNT_ZERO,
} from '../../../../../util/Config.js';
import {
  formatAmountForOutput,
  setAmountCursorPosition,
  setAmountCursorOnClick,
  toggleEmojiInputField,
  removeUtilityClasses,
  isActiveHTMLElement,
  activateHTMLElement,
  deactivateHTMLElement,
} from '../../../../util/RenderHelper.js';
import { debounce } from '../../../../util/InputHelper.js';
import formHelper from '../../../common/TransactionFormHelper.js';
import alignmentHelper from '../../../../util/AlignmentHelper.js';

class ExpenseMainFormView {
  #headerAddCaption = 'Добавить трату';
  #headerEditCaption = 'Редактировать';
  #buttonNoteCaptionEmpty = 'написать';
  #buttonNoteCaption = 'редактировать';
  #submitAddCaption = 'добавить';
  #submitEditCaption = 'сохранить';
  #titlePlaceholder = 'Введите название';
  #paidByCaptionEmpty = 'пока никто';
  #paidByCaptionCopayment = 'совместно';
  #paidByCaptionCurrentUser = 'вы';
  #paidByCaptions = new Map();
  #splittCaptionEqually = 'поровну';
  #splittCaptionParts = 'частями';
  #splittCaptionShares = 'долями';
  #splittCaptions = new Map();
  #labelPaidBy = 'Кто платил';
  #labelSplitt = 'Поделить';
  #balanceLabelDefault = 'ваш баланс:\u00A0';
  #balanceLabelCheckForm = formName => `проверьте форму «${formName}»`;
  #balanceLabelAmountBelowMin = 'слишком малая сумма';
  #balanceLabelAmountZero = 'введите сумму траты';
  #balanceAmountOptions = [POSITIVE_CLASS, NEGATIVE_CLASS, HIDDEN_CLASS];
  #form;
  #mainForm;
  #hiddenForms;
  #buttonsEdit;
  #header;
  #inputTitle;
  #inputAmount;
  #inputDate;
  #buttonPaidBy;
  #buttonSplitt;
  #buttonNote;
  #buttonClose;
  #buttonSubmit;
  #balanceLabel;
  #balanceAmount;
  #emojiRow;
  #emojiInputField;
  #emojiDefaultBtn;
  #emojiPickerSwitchBtn;
  #emojiRemoveBtn;

  constructor() {
    this.#hiddenForms = document.querySelectorAll('.add-expense__form-hidden');
    this.#parseFormElements();
    this.#parseEmojiElements();
    this.#parseResetButtons();
    this.#loadPaidByCaptions();
    this.#loadSplittCaptions();
    this.#loadPlaceholders();
  }

  #parseFormElements = () => {
    this.#form = document.querySelector('.add-expense__form');
    this.#mainForm = document.querySelector('.add-expense__form_main');
    this.#header = document.querySelector('.add-expense__form_header_text');
    this.#inputTitle = document.querySelector('.add-expense-title');
    this.#inputAmount = document.querySelector('.add-expense-amount');
    this.#inputDate = document.querySelector('.add-expense-date');
    this.#buttonsEdit = document.querySelectorAll('.add-expense__btn-edit');
    this.#buttonPaidBy = document.querySelector('.btn__paid-by');
    this.#buttonSplitt = document.querySelector('.btn__open-splitt-form');
    this.#buttonNote = document.querySelector('.btn__expense-note');
    this.#balanceLabel = document.querySelector('.splitt-balance-note__label');
    this.#balanceAmount = document.querySelector(
      '.splitt-balance-note__amount'
    );
    this.#buttonClose = document.querySelector('.add-expense__btn--close');
    this.#buttonSubmit = document.querySelector('.add-expense__btn--submit');
  };

  #parseEmojiElements = () => {
    this.#emojiRow = document.querySelector('.add-expense-emoji-row');
    this.#emojiInputField = document.querySelector('.emoji-input.add-expense');
    this.#emojiDefaultBtn = document.querySelector(
      '.btn__emoji-restore-default.add-expense'
    );
    this.#emojiPickerSwitchBtn = document.querySelector(
      '.btn__emoji-picker--switch.add-expense'
    );
    this.#emojiRemoveBtn = document.querySelector(
      '.btn__emoji-remove.add-expense'
    );
  };

  #parseResetButtons = () => {
    //
  };

  #loadPaidByCaptions = () => {
    this.#paidByCaptions.set(EXPENSE_PAID_BY_EMPTY, this.#paidByCaptionEmpty);
    this.#paidByCaptions.set(
      EXPENSE_PAID_BY_COPAYMENT,
      this.#paidByCaptionCopayment
    );
    this.#paidByCaptions.set(
      EXPENSE_PAID_BY_CURRENT_USER,
      this.#paidByCaptionCurrentUser
    );
  };

  #loadSplittCaptions = () => {
    this.#splittCaptions.set(
      EXPENSE_SPLITT_EQUALLY,
      this.#splittCaptionEqually
    );
    this.#splittCaptions.set(EXPENSE_SPLITT_PARTS, this.#splittCaptionParts);
    this.#splittCaptions.set(EXPENSE_SPLITT_SHARES, this.#splittCaptionShares);
  };

  #loadPlaceholders = () => {
    this.#inputTitle.placeholder = this.#titlePlaceholder;
  };

  // ADD HANDLERS

  addHandlerTitleInput = handler => {
    this.#inputTitle.addEventListener('input', debounce(handler, 300));
  };

  addHandlerAmountInput = handler => {
    this.#inputAmount.addEventListener('input', debounce(handler, 50));
  };

  addHandlerAmountInputClick = handler => {
    this.#inputAmount.addEventListener('click', handler);
  };

  addHandlerDateInput = handler => {
    this.#inputDate.addEventListener('input', handler);
  };

  addHandlerPaidByButtonClick = handler => {
    this.#buttonPaidBy.addEventListener('click', handler);
  };

  addHandlerSplittButtonClick = handler => {
    this.#buttonSplitt.addEventListener('click', handler);
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
      handler(DEFAULT_EMOJI_EXPENSE)
    );
  };

  addHandlerEmojiRemoveBtnClick = handler => {
    this.#emojiRemoveBtn.addEventListener('click', handler);
  };

  // GETTERS

  get form() {
    return this.#form;
  }

  getHiddenFormButtons = () => {
    return {
      buttonNote: this.#buttonNote,
      buttonPaidBy: this.#buttonPaidBy,
      buttonSplitt: this.#buttonSplitt,
    };
  };

  isActive = () => {
    return isActiveHTMLElement(this.#form);
  };

  getEmojiField = () => {
    return {
      inputField: this.#emojiInputField,
      defaultBtn: this.#emojiDefaultBtn,
      pickerSwitchBtn: this.#emojiPickerSwitchBtn,
      removeBtn: this.#emojiRemoveBtn,
      formType: TYPE_EXPENSE,
    };
  };

  // Activate / Deactivate

  activate = () => {
    activateHTMLElement(this.#form);
  };

  deactivate = () => {
    deactivateHTMLElement(this.#form);
  };

  // Render: Form

  render = data => {
    const {
      type,
      title,
      amount,
      emoji,
      date,
      note,
      isValid,
      paidBy,
      splitt,
      balance,
    } = data;
    this.#renderCaptions(type);
    this.renderTitle(title);
    this.#renderAmount(amount);
    this.renderEmoji(emoji);
    this.renderDate(date);
    this.renderPaidByButtonCaption(paidBy);
    this.renderSplittButtonCaption(splitt.type);
    this.renderBalance(balance);
    this.renderNoteButtonCaption(!note);
    this.renderSubmitButton(isValid);
  };

  // Render: Elements

  renderTitle = title => {
    this.#inputTitle.value = title ? title : '';
  };

  renderAmountInput = ({ processedAmount, amountIn, cursorPosition }) => {
    const inputElement = this.#inputAmount;
    formHelper.renderAmountInput({
      processedAmount,
      amountIn,
      cursorPosition,
      inputElement,
    });
  };

  adjustAmountInputCursor = ({ inputValue, cursorPosition }) => {
    const inputElement = this.#inputAmount;
    setAmountCursorOnClick({ inputValue, inputElement, cursorPosition });
  };

  renderSubmitButton = isFormValid => {
    const submitButton = this.#buttonSubmit;
    formHelper.renderSubmitButton(submitButton, isFormValid);
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

  updateDateInput = ({ min, max, updateDefaultDate }) => {
    const dateInput = this.#inputDate;
    formHelper.updateDateInput({ min, max, updateDefaultDate, dateInput });
  };

  /**
   * Renders the "Paid By" button caption.
   * @param {Object} paidBy - The object containing "paid by" details.
   * @param {string} paidBy.type - The paid by type.
   * @param {string|null} paidBy.name - The name of the payer or `null` if not required.
   */
  renderPaidByButtonCaption = ({ type, name }) => {
    this.#buttonPaidBy.textContent = this.#paidByCaptions.has(type)
      ? this.#paidByCaptions.get(type)
      : name;
  };

  /**
   * Renders the "Splitt" button caption.
   * @param {string} splittType — The "splitt" type.
   */
  renderSplittButtonCaption = type => {
    this.#buttonSplitt.textContent = this.#splittCaptions.get(type);
  };

  /**
   * Renders the balance display based on the balance status.
   *
   * @param {Object} balance - The balance object.
   * @param {string} balance.status - The status of the balance, e.g. {@link EXPENSE_BALANCE_DEFAULT}.
   * @param {number|null} balance.amount - The balance amount (required for "default" status).
   */
  renderBalance = balance => {
    removeUtilityClasses(this.#balanceAmount, this.#balanceAmountOptions);
    switch (balance.status) {
      case EXPENSE_BALANCE_DEFAULT:
        this.#renderBalanceDefault(balance.amount);
        break;
      case EXPENSE_BALANCE_AMOUNT_ZERO:
        this.#renderBalanceAmountZero();
        break;
      case EXPENSE_BALANCE_AMOUNT_BELOW_MIN:
        this.#renderBalanceAmountBelowMin();
        break;
      case EXPENSE_BALANCE_CHECK_PAID_BY:
      case EXPENSE_BALANCE_CHECK_SPLITT:
        this.#renderBalanceCheckForm(balance.status);
        break;
      default:
        console.warn(`Unexpected balance status: ${balance.status}`);
    }
  };

  renderNoteButtonCaption = isEmpty => {
    this.#buttonNote.textContent = isEmpty
      ? this.#buttonNoteCaptionEmpty
      : this.#buttonNoteCaption;
  };

  // Render: Edit Form

  // Render: Private Methods

  #renderCaptions = formType => {
    if (formType === EXPENSE_FORM_EDIT) {
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

  /**
   * Renders the default balance display, which includes the balance label and amount.
   *
   * @private
   * @param {number} amount - The balance amount.
   */
  #renderBalanceDefault = amount => {
    this.#balanceLabel.textContent = this.#balanceLabelDefault;
    this.#balanceAmount.textContent = formatAmountForOutput(amount, {
      showSign: true,
    });

    if (amount === 0) return;
    if (amount > 0) {
      this.#balanceAmount.classList.add(POSITIVE_CLASS);
    } else {
      this.#balanceAmount.classList.add(NEGATIVE_CLASS);
    }
  };

  /**
   * Renders the balance "check form" display.
   * Displayed when one of the hidden forms is invalid
   *
   * @private
   * @param {string} balanceStatus - The status of the balance. Expected one of:
   *                                 a) {@link EXPENSE_BALANCE_CHECK_SPLITT}
   *                                 b) {@link EXPENSE_BALANCE_CHECK_PAID_BY}
   */
  #renderBalanceCheckForm = balanceStatus => {
    const formToCheck =
      balanceStatus === EXPENSE_BALANCE_CHECK_SPLITT
        ? this.#labelSplitt
        : this.#labelPaidBy;
    this.#balanceLabel.textContent = this.#balanceLabelCheckForm(formToCheck);
    this.#balanceAmount.classList.add(HIDDEN_CLASS);
  };

  /**
   * Renders the balance, when the provided expense amount is below minimum.
   *
   * @private
   */
  #renderBalanceAmountBelowMin = () => {
    this.#balanceLabel.textContent = this.#balanceLabelAmountBelowMin;
    this.#balanceAmount.classList.add(HIDDEN_CLASS);
  };

  /**
   * Renders the balance, when the provided expense amount is zero.
   *
   * @private
   */
  #renderBalanceAmountZero = () => {
    this.#balanceLabel.textContent = this.#balanceLabelAmountZero;
    this.#balanceAmount.classList.add(HIDDEN_CLASS);
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
    return { fieldId: TYPE_EXPENSE, topMargin };
  };
}

export default new ExpenseMainFormView();
