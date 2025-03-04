class TransactionFormManager {
  #transactionType;
  #formCollection;
  #formTypeEdit;
  #formTypes;
  #emojiEditEvent;

  constructor(config) {
    const {
      transactionType,
      formCollection,
      formTypes,
      formTypeEdit,
      emojiEditEvent,
    } = config;
    this.#transactionType = transactionType;
    this.#formCollection = formCollection;
    this.#formTypes = formTypes;
    this.#formTypeEdit = formTypeEdit;
    this.#emojiEditEvent = emojiEditEvent;
  }

  // Getters and Setters

  /**
   * Retrieves the currently active form.
   *
   * @returns {RepaymentFormState|null} The active form state object or null, if none is selected.
   */
  getActiveForm = () => {
    return this.#formCollection.activeForm;
  };

  /**
   * Sets the active form based on the provided type.
   *
   * @param {string} formType - The transaction form type to set as active.
   *                            Must be one of {@link REPAYMENT_FORM_TYPES} or {@link EXPENSE_FORM_TYPES}.
   * @throws {Error} Throws an error if the provided type is not valid.
   */
  setActiveForm = formType => {
    this.#validateFormType(formType);
    this.#formCollection.activeForm = formType;
  };

  /**
   * Gets the currently active hidden form type.
   *
   * @returns {string|null} The active hidden form element or null, if none is set.
   */
  getActiveHiddenForm = () => {
    return this.#formCollection.activeForm.activeHiddenForm;
  };

  /**
   * Sets the active hidden form.
   *
   * @param {string|null} type The hidden form type to set as active or null to deactivate.
   */
  setActiveHiddenForm = type => {
    if (this.#formCollection.activeForm) {
      this.#formCollection.activeForm.activeHiddenForm = type;
    }
  };

  // Update

  /**
   * Updates the date for the active form.
   * If the form type is the edit form, it performs validation and returns a detailed object.
   * Otherwise, it updates the date directly and returns a simplified object.
   *
   * @param {Date} date The new date to set.
   * @returns {Object} The update result object.
   */
  updateDate = date => {
    const form = this.getActiveForm();
    const formType = form.type;
    if (formType === this.#formTypeEdit) {
      const { isFormValid, hasEdits, isFieldEdited } = form.editDate(date);
      return { formType, isFormValid, hasEdits, isFieldEdited };
    } else {
      form.date = date;
      return { formType };
    }
  };

  /**
   * Updates the active form's emoji field.
   *
   * @param {string} emoji - The new emoji to set for the active form.
   * @fires {string} this.#emojiEditEvent - Emits when the emoji is updated in the "edit" form.
   */
  updateEmoji = emoji => {
    const form = this.getActiveForm();
    if (form.type === this.#formTypeEdit) {
      const editResponse = form.editEmoji(emoji);
      eventBus.emit(this.#emojiEditEvent, editResponse);
    } else {
      form.emoji = emoji;
    }
  };

  // Validate

  /**
   * Validates the transaction form type.
   * @param {string} type The form type to validate.
   * @throws {Error} If the value is not one of {@link REPAYMENT_FORM_TYPES} or {@link EXPENSE_FORM_TYPES}.
   */
  #validateFormType = type => {
    if (!this.#formTypes.has(type)) {
      throw new Error(
        `Invalid ${
          this.#transactionType
        } form type: "${type}" (${typeof type}). Expected one of: ${Array.from(
          this.#formTypes
        ).join(', ')}.`
      );
    }
  };
}

export default TransactionFormManager;
