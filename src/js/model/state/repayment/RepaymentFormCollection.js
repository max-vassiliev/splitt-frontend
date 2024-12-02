import RepaymentFormState from './RepaymentFormState.js';
import RepaymentFormEditState from './RepaymentFormEditState.js';
import {
  REPAYMENT_FORM_ADD,
  REPAYMENT_FORM_SETTLE,
  REPAYMENT_FORM_TYPES,
} from '../../../util/Config.js';

class RepaymentFormCollection {
  #activeForm;
  #add;
  #settle;
  #edit;

  constructor() {
    this.#activeForm = null;
    this.#add = new RepaymentFormState(REPAYMENT_FORM_ADD);
    this.#settle = new RepaymentFormState(REPAYMENT_FORM_SETTLE);
    this.#edit = RepaymentFormEditState;
  }

  /**
   * Gets the active repayment form state.
   * @returns {RepaymentFormState|null} The active repayment form state.
   */
  get activeForm() {
    return this.#activeForm;
  }

  /**
   * Sets the active repayment form state.
   * @param {string|null} formType The form type to set as active (e.g., 'add' or 'settle'). See {@link REPAYMENT_FORM_TYPES}.
   * @throws {Error} If the form type is invalid or no form is assigned to the field.
   */
  set activeForm(formType) {
    if (formType === null) {
      this.#activeForm = null;
      return;
    }

    if (!REPAYMENT_FORM_TYPES.has(formType)) {
      throw new Error(`Invalid form type: ${formType}.`);
    }

    const form = this[formType];
    if (!form) {
      console.warn(`No form assigned to the field: ${formType}.`);
      return;
    }

    this.#activeForm = form;
  }

  /**
   * Gets the add repayment form state.
   * @returns {RepaymentFormState} The add repayment form state.
   */
  get add() {
    return this.#add;
  }

  /**
   * Sets the add repayment form state.
   * @param {RepaymentFormState} value The add repayment form state.
   */
  set add(value) {
    this.#validateRepaymentFormState(value);
    this.#add = value;
  }

  /**
   * Gets the settle repayment form state.
   * @returns {RepaymentFormState} The settle repayment form state.
   */
  get settle() {
    return this.#settle;
  }

  /**
   * Sets the settle repayment form state.
   * @param {RepaymentFormState} value - The settle repayment form state.
   */
  set settle(value) {
    this.#validateRepaymentFormState(value);
    this.#settle = value;
  }

  /**
   * Gets the edit repayment form state.
   * @returns {RepaymentFormEditState} The edit repayment form state.
   */
  get edit() {
    return this.#edit;
  }

  /**
   * Validates that the value is an instance of RepaymentFormState.
   * @param {any} value - The value to validate.
   * @throws {Error} If the value is not an instance of {@link RepaymentFormState}.
   */
  #validateRepaymentFormState(value) {
    if (!(value instanceof RepaymentFormState)) {
      throw new Error(
        `Invalid value: expected an instance of RepaymentFormState. Received: ${value} (type: ${typeof value}).`
      );
    }
  }
}

export default new RepaymentFormCollection();
