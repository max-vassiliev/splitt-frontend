import { DISABLED_ATTRIBUTE } from '../../../../../util/Config.js';

class PaidByEntryView {
  #entryId;
  #userId;
  #payerSwitch;
  #payerOptions;
  #avatarElement;
  #amountInput;

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
  }) {
    this.#entryId = entryId;
    this.#payerSwitch = payerSwitch;
    this.#amountInput = amountInput;
    this.#avatarElement = avatarElement;
    this.#payerOptions = payerOptions;
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
   * @param {bigint} userId The new user ID.
   * @throws {TypeError} If userId is not a bigint.
   */
  set userId(userId) {
    if (typeof userId !== 'bigint') {
      throw new TypeError(
        `userId must be a bigint. Received: ${userId} (${typeof userId}).`
      );
    }
    this.#userId = userId;
  }

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
}

export default PaidByEntryView;
