import {
  EXPENSE_FORM_TYPES,
  EXPENSE_SPLITT_TYPES,
  DEFAULT_EMOJI_EXPENSE,
} from '../../util/Config.js';
import ExpenseFormState from '../state/expense/ExpenseFormState.js';
import state from '../state/State.js';

class ExpenseManager {
  init = () => {
    this.#initForms();
  };

  // Getters and Setters

  /**
   * Retrieves the currently active expense form.
   *
   * @returns {ExpenseFormState|null} The active expense form state object or null, if none is selected.
   */
  getActiveForm = () => {
    return state.expenseForms.activeForm;
  };

  /**
   * Sets the active expense form based on the provided type.
   *
   * @param {string} formType - The type of the expense form to set as active.
   *                            Must be one of [EXPENSE_FORM_TYPES]{@link EXPENSE_FORM_TYPES}.
   * @throws {Error} Throws an error if the provided type is not valid.
   */
  setActiveForm = formType => {
    this.#validateFormType(formType);
    state.expenseForms.activeForm = formType;
  };

  /**
   * Gets the currently active hidden form type.
   *
   * @returns {string|null} The active hidden form element or null, if none is set.
   */
  getActiveHiddenForm = () => {
    return state.expenseForms.activeForm.activeHiddenForm;
  };

  /**
   * Sets the active hidden form.
   *
   * @param {string|null} type The hidden form type to set as active or null to deactivate.
   */
  setActiveHiddenForm = type => {
    if (state.expenseForms.activeForm) {
      state.expenseForms.activeForm.activeHiddenForm = type;
    }
  };

  // Update

  /**
   * Updates the title of the active form and revalidates the form for submission.
   *
   * @param {string} title - The updated title to set.
   * @returns {Object} The updated state of the form.
   * @property {string|null} title - The new title of the expense.
   * @property {boolean} isValid - Indicates if the form remains valid after the update.
   */
  updateTitle = title => {
    const form = this.getActiveForm();
    form.title = title;
    form.validateForSubmission();
    return { title, isValid: form.isValid };
  };

  /**
   * Updates the amount for the active form and propagates changes to related subforms.
   *
   * @param {number} amount - The new amount to set.
   * @returns {Object} The update result object.
   * @property {Object} form - The updated active form.
   * @property {Object} updateResponsePaidBy - The result of the Paid By form update.
   */
  updateAmount = amount => {
    const form = this.getActiveForm();
    form.amount = amount;
    const updateResponsePaidBy =
      form.paidBy.updateAfterExpenseAmountChange(amount);
    form.splitt.activeForm.update({
      expenseAmount: amount,
    });
    form.validateForSubmission();
    return { form, updateResponsePaidBy };
  };

  /**
   * Updates the active Splitt Form type and recalculates values if needed.
   * If the requested type is already active, no changes are made.
   * Otherwise, the corresponding form is retrieved, recalculated, and set as active.
   * The form is then validated for submission.
   *
   * @param {string} type - The new Splitt type to activate. See {@link EXPENSE_SPLITT_TYPES}.
   * @returns {Object} An object indicating whether the update occurred and the updated active form.
   * @property {boolean} isUpdated - `true` if the Splitt type was updated, `false` otherwise.
   * @property {Object} [expenseForm] - The updated expense form state if an update occurred.
   */
  updateSplittType = type => {
    const expenseForm = this.getActiveForm();
    if (expenseForm.splitt.activeForm.type === type) {
      return { isUpdated: false };
    }
    const splittForm = expenseForm.splitt.getForm(type);
    splittForm.recalculate(expenseForm.amount);
    expenseForm.splitt.activeForm = splittForm;

    expenseForm.validateForSubmission();
    return { isUpdated: true, form: expenseForm };
  };

  // Initialize

  /**
   * Initializes the default data and configurations for the expense form state.
   */
  #initForms = () => {
    this.#initAddForm();
  };

  /**
   * Initializes the default data and configurations for the add expense form state.
   */
  #initAddForm = () => {
    const addForm = state.expenseForms.add;
    const currentUserId = state.userId;
    const userIds = [...state.members.keys()];

    addForm.emoji = DEFAULT_EMOJI_EXPENSE;
    addForm.paidBy.init(currentUserId);
    addForm.splitt.equally.init(userIds);
    addForm.splitt.parts.init(userIds);
    addForm.splitt.shares.init(userIds);
  };

  // Reset

  // TODO! пока наброски: разделение между init() и reset()
  #resetAddForm = () => {
    const addForm = state.expenseForms.add;
    const currentUserId = state.userId;
    const userIds = [...state.members.keys()];

    addForm.emoji = DEFAULT_EMOJI_EXPENSE;
    addForm.paidBy.reset(currentUserId);
  };

  // Validate

  /**
   * Validates the expense form type.
   * @param {string} type The expense form type to validate.
   * @throws {Error} If the value is not one of [EXPENSE_FORM_TYPES]{@link EXPENSE_FORM_TYPES}.
   */
  #validateFormType = type => {
    if (!EXPENSE_FORM_TYPES.has(type)) {
      throw new Error(
        `Invalid expense form type: "${type}" (${typeof type}). Expected one of: ${Array.from(
          EXPENSE_FORM_TYPES
        ).join(', ')}.`
      );
    }
  };
}

export default new ExpenseManager();
