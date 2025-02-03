import {
  EXPENSE_FORM_TYPES,
  DEFAULT_EMOJI_EXPENSE,
} from '../../util/Config.js';
import ExpenseFormState from '../state/expense/ExpenseFormState.js';
import state from '../state/State.js';

class ExpenseManager {
  init = () => {
    this.#loadDefaultData();
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

  /**
   * Retrieves the data to set up the Paid By subform of Expense Add Form.
   *
   * @returns {Object} The object containing the data to set up the Paid By subform.
   * @property {number} defaultEntryId — ID of the default entry.
   */
  getAddPaidBySetupData = () => {
    const defaultEntryId = state.expenseForms.add.paidBy.defaultEntryId;
    return { defaultEntryId };
  };

  // Initialize

  /**
   * Initializes the default data and configurations for the expense form state.
   */
  #loadDefaultData = () => {
    this.#loadAddFormDefaultData();
  };

  /**
   * Initializes the default data and configurations for the add expense form state.
   */
  #loadAddFormDefaultData = () => {
    const addForm = state.expenseForms.add;
    const currentUserId = state.userId;
    const userIds = [...state.members.keys()];

    addForm.emoji = DEFAULT_EMOJI_EXPENSE;
    addForm.paidBy.init(currentUserId);
    addForm.splitt.equally.init(userIds);
    addForm.splitt.parts.init(userIds);
    addForm.splitt.shares.init(userIds);
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
