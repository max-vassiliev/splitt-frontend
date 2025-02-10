class PaidByEntryView {
  #entryId;
  #userId; // TODO! подумать, нужно ли
  #payerSwitch;
  #amountInput;

  /**
   * Creates a new PaidByEntryView instance.
   * @param {number} entryId The unique identifier for this entry.
   * @param {HTMLElement} payerSwitch The switch element for selecting payer status.
   * @param {HTMLElement} amountInput The input element for specifying the amount.
   */
  constructor(entryId, payerSwitch, amountInput) {
    this.#entryId = entryId;
    this.#payerSwitch = payerSwitch;
    this.#amountInput = amountInput;
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
   * Gets the amount input element.
   * @returns {HTMLElement} The amount input element or `undefined` if not assigned.
   */
  get amountInput() {
    return this.#amountInput;
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
}

export default PaidByEntryView;
