import {
  DISABLED_ATTRIBUTE,
  READONLY_ATTRIBUTE,
  EXPENSE_PAID_BY_OPTION_EMPTY_ID,
  DEFAULT_AVATAR,
  DEFAULT_AMOUNT,
  HIDDEN_CLASS,
} from '../../../../../util/Config.js';
import {
  getAvatarUrl,
  formatAmountForOutput,
} from '../../../../util/RenderHelper.js';

class PaidByEntryView {
  #entryId;
  #userId;
  #payerSwitch;
  #payerOptions;
  #avatarElement;
  #amountInput;
  #rowElement;

  /**
   * Creates a new PaidByEntryView instance.
   * @param {number} entryId The unique identifier for this entry.
   * @param {HTMLElement} payerSwitch The switch element for selecting payer status.
   * @param {HTMLElement} amountInput The input element for specifying the amount.
   * @param {HTMLElement} avatarElement The avatar <img> element that stores the avatar.
   */
  constructor({
    entryId,
    payerSwitch,
    payerOptions,
    amountInput,
    avatarElement,
    rowElement,
  }) {
    this.#entryId = entryId;
    this.#payerSwitch = payerSwitch;
    this.#amountInput = amountInput;
    this.#avatarElement = avatarElement;
    this.#payerOptions = payerOptions;
    this.#rowElement = rowElement;
  }

  // Getters

  /**
   * Gets the entry ID.
   * @returns {number|undefined} The entry ID or `undefined` if not assigned.
   */
  get entryId() {
    return this.#entryId;
  }

  /**
   * Gets the user ID.
   * @returns {bigint|undefined} The user ID or `undefined` if not assigned.
   */
  get userId() {
    return this.#userId;
  }

  /**
   * Gets the entire payer row element.
   * @returns {HTMLElement} The row element.
   */
  get rowElement() {
    return this.#rowElement;
  }

  /**
   * Gets the payer switch element.
   * @returns {HTMLElement} The payer switch element or `undefined` if not assigned.
   */
  get payerSwitch() {
    return this.#payerSwitch;
  }

  /**
   * Gets the payer options map.
   * @returns {Map<BigInt, HTMLElement>} The map with the user ID as the key
   *                                     and the assiciated <option> element as the value.
   */
  get payerOptions() {
    return this.#payerOptions;
  }

  /**
   * Gets the amount input element.
   * @returns {HTMLElement} The amount input element or `undefined` if not assigned.
   */
  get amountInput() {
    return this.#amountInput;
  }

  /**
   * Gets the payer's avatar <img> element.
   * @returns {HTMLElement} The avatar element.
   */
  get avatarElement() {
    return this.#avatarElement;
  }

  // Setters

  /**
   * Sets the user ID.
   * @param {bigint|null} userId The new user ID or null.
   * @throws {TypeError} If userId is not a bigint.
   */
  set userId(userId) {
    if (!(typeof userId === 'bigint' || userId === null)) {
      throw new TypeError(
        `userId must be a bigint or null. Received: ${userId} (${typeof userId}).`
      );
    }
    this.#userId = userId;
  }

  // Render

  render = data => {
    const { userId, avatar, amount, isDefault, isSingleEntry, usersToDisable } =
      data;

    this.renderUser(userId);
    this.renderAvatar(avatar);
    this.renderAmount(amount, isDefault, isSingleEntry);
    if (usersToDisable && usersToDisable.size > 0) {
      this.deactivatePayerOptions(usersToDisable);
    }
    this.show();
  };

  renderUser = userId => {
    this.userId = userId;
    if (userId) {
      this.#payerSwitch.value = String(userId);
    } else {
      this.#payerSwitch.value = EXPENSE_PAID_BY_OPTION_EMPTY_ID.toString();
    }
  };

  renderAvatar = avatar => {
    this.#avatarElement.src = getAvatarUrl(avatar);
  };

  renderAmount = (amount, isDefault = false, isSingleEntry = false) => {
    this.#amountInput.value = formatAmountForOutput(amount);
    if (isDefault) this.toggleAmountInput(isSingleEntry);
  };

  // Update

  updateOptionsAfterPayerChange = (addedUserId, removedUserId) => {
    this.#payerOptions.forEach((payerOption, payerId) => {
      if (payerId === removedUserId) {
        payerOption.removeAttribute(DISABLED_ATTRIBUTE);
        return;
      }
      if (payerId === addedUserId && this.#userId !== addedUserId) {
        payerOption.setAttribute(DISABLED_ATTRIBUTE, DISABLED_ATTRIBUTE);
      }
    });
  };

  // Toggle Elements

  reset = () => {
    this.#avatarElement.src = getAvatarUrl(DEFAULT_AVATAR);
    this.#amountInput.value = formatAmountForOutput(DEFAULT_AMOUNT);
    this.#payerSwitch.value = EXPENSE_PAID_BY_OPTION_EMPTY_ID.toString();
    this.#payerOptions.forEach((option, payerId) => {
      if (payerId === EXPENSE_PAID_BY_OPTION_EMPTY_ID) return;
      option.removeAttribute(DISABLED_ATTRIBUTE);
    });
  };

  deactivatePayerOptions = payerOptions => {
    payerOptions.forEach(payerId => {
      if (payerId !== this.#userId) this.deactivatePayerOption(payerId);
    });
  };

  deactivatePayerOption = optionId => {
    const payerOption = this.#payerOptions.get(optionId);
    if (!payerOption) return;
    payerOption.setAttribute(DISABLED_ATTRIBUTE, DISABLED_ATTRIBUTE);
  };

  activatePayerOption = optionId => {
    const payerOption = this.#payerOptions.get(optionId);
    if (!payerOption) return;
    payerOption.removeAttribute(DISABLED_ATTRIBUTE);
  };

  toggleAmountInput = isSingleEntry => {
    if (isSingleEntry) {
      this.deactivateInput();
    } else {
      this.activateInput();
    }
  };

  activateInput = () => {
    this.#amountInput.removeAttribute(READONLY_ATTRIBUTE);
  };

  deactivateInput = () => {
    this.#amountInput.setAttribute(READONLY_ATTRIBUTE, READONLY_ATTRIBUTE);
  };

  focusInput = () => {
    this.#amountInput.focus();
  };

  hide = () => {
    this.#rowElement.classList.add(HIDDEN_CLASS);
  };

  show = () => {
    this.#rowElement.classList.remove(HIDDEN_CLASS);
  };
}

export default PaidByEntryView;
