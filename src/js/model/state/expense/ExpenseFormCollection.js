import {
  EXPENSE_FORM_ADD,
  EXPENSE_FORM_EDIT,
  EXPENSE_FORM_TYPES,
} from '../../../util/Config.js';
import ExpenseFormState from './ExpenseFormState.js';

class ExpenseFormCollection {
  #activeForm;
  #add;
  #edit;
  #forms;

  constructor() {
    this.#add = new ExpenseFormState(EXPENSE_FORM_ADD);
    this.#activeForm = null;
    this.#initFormsMap();
  }

  #initFormsMap = () => {
    this.#forms = new Map();
    this.#forms.set(EXPENSE_FORM_ADD, this.#add);
  };

  /**
   * Gets the active expense form state.
   * @returns {ExpenseFormState} The active expense form state.
   */
  get activeForm() {
    return this.#activeForm;
  }

  /**
   * Sets the active expense form state.
   * @param {string} formType The form type to set as active. See {@link EXPENSE_FORM_TYPES}.
   * @throws {Error} If the form type is invalid or no form is assigned to the privided `formType` parameter.
   */
  set activeForm(formType) {
    if (!EXPENSE_FORM_TYPES.has(formType)) {
      throw new Error(`Invalid form type: ${formType}.`);
    }

    const form = this.#forms.get(formType);
    if (!form) {
      console.warn(`No form assigned to the field: ${formType}.`);
      return;
    }

    this.#activeForm = form;
  }

  /**
   * Gets the add expense form.
   * @returns {ExpenseFormState} The add expense form state.
   */
  get add() {
    return this.#add;
  }
}

export default new ExpenseFormCollection();
