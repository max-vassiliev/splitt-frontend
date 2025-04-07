import {
  TYPE_EXPENSE,
  EXPENSE_FORM_TYPES,
  EXPENSE_FORM_ADD,
  EXPENSE_FORM_EDIT,
  EXPENSE_SPLITT_TYPES,
  DEFAULT_EMOJI_EXPENSE,
  EVENT_EXPENSE_EMOJI_EDIT,
  MIN_EXPENSE_AMOUNT,
} from '../../../util/Config.js';
import state from '../../state/State.js';
import ExpenseFormState from '../../state/expense/ExpenseFormState.js';
import TransactionFormManager from '../common/TransactionFormManager.js';

class ExpenseManager extends TransactionFormManager {
  constructor() {
    super({
      transactionType: TYPE_EXPENSE,
      formCollection: state.expenseForms,
      formTypes: EXPENSE_FORM_TYPES,
      formTypeEdit: EXPENSE_FORM_EDIT,
      emojiEditEvent: EVENT_EXPENSE_EMOJI_EDIT,
    });
  }

  init = () => {
    this.#initForms();
  };

  // Getters

  /**
   * Gets the add expense form.
   * @returns {ExpenseFormState} The add expense form state.
   */
  getAddForm = () => {
    return state.expenseForms.add;
  };

  // Update: Main Form

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
   * @param {boolean} [isBelowMin=false] - Indicates if the amount is greater than 0 but below {@link MIN_EXPENSE_AMOUNT}.
   * @returns {Object} The update result object.
   * @property {Object} form - The updated active form.
   * @property {Object} updateResponsePaidBy - The result of the Paid By form update.
   */
  updateAmount = (amount, isBelowMin = false) => {
    const form = this.getActiveForm();
    form.amount = amount;
    if (form.isAmountBelowMin !== isBelowMin) {
      form.isAmountBelowMin = isBelowMin;
    }
    const updateResponsePaidBy =
      form.paidBy.updateAfterExpenseAmountChange(amount);
    form.splitt.activeForm.update({
      expenseAmount: amount,
    });
    form.validateForSubmission();
    return { form, updateResponsePaidBy };
  };

  // Update: Paid By

  /**
   * Updates the payer for a given entry in the active form.
   *
   * @param {number} entryId - The ID of the expense entry to update.
   * @param {bigint} newPayerId - The ID of the newly assigned payer.
   * @returns {Object} An object containing the added and removed user IDs and the updated Paid By state.
   */
  updatePayer = (entryId, newPayerId) => {
    const form = this.getActiveForm();
    const { addedUserId, removedUserId } = form.paidBy.updateUser(
      entryId,
      newPayerId
    );
    return { addedUserId, removedUserId, paidByState: form.paidBy };
  };

  /**
   * Updates the amount assigned to a payer entry in the active form.
   *
   * @param {number} entryId - The ID of the payer entry to update.
   * @param {number} amount - The new amount to assign.
   * @returns {Object} An object containing the update response and the updated form.
   */
  updatePayerAmount = (entryId, amount) => {
    const form = this.getActiveForm();
    const expenseAmount = form.amount;
    const response = form.paidBy.updateAmount(entryId, amount, expenseAmount);
    form.validateForSubmission();
    return { response, form };
  };

  /**
   * Delegates the addition of a Paid By entry to the PaidByState of the active expense form.
   *
   * @returns {Object} The response object from the PaidByState.
   */
  addPaidByEntry = () => {
    const form = this.getActiveForm();
    return form.paidBy.addEntry();
  };

  /**
   * Removes a payer entry from the active expense form's active entries map.
   *
   * @param {number} entryId - The ID of the entry to be removed.
   * @returns {Object} - An object containing the response details and the updated form.
   */
  removePaidByEntry = entryId => {
    const form = this.getActiveForm();
    const expenseAmount = form.amount;
    const response = form.paidBy.removeEntry(entryId, expenseAmount);
    if (!response.isRemoved) return { isRemoved: response.isRemoved };

    form.validateForSubmission();
    return { response, form };
  };

  // Update: Splitt

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

  /**
   * Updates the splitt value for a user in the active splitt form.
   * @param {bigint} userId - The ID of the user whose splitt is being updated.
   * @param {number | null} value - The new splitt value to apply.
   * @returns {Object} An object containing the update response and the updated form.
   */
  updateSplitt = (userId, value) => {
    const form = this.getActiveForm();
    const expenseAmount = form.amount;
    const splittState = form.getActiveSplitt();
    const response = splittState.update({ expenseAmount, userId, value });
    form.validateForSubmission();
    return { response, form };
  };

  // Update: Note

  /**
   * Updates the note in the active expense form.
   *
   * @param {string|null} note - The processed note to save. Can be null if the note is empty.
   * @returns {Object} The result of the update operation.
   */
  updateNote = note => {
    const form = this.getActiveForm();
    const formType = form.type;
    form.note = note;
    return { formType };
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

  /**
   * Resets the currently active form.
   *
   * @returns {Object} The reset response object.
   * @property {boolean} shouldRender Indicates whether the form should be rendered.
   * @property {ExpenseFormState} [form] The active form's current state, if rendering is required.
   */
  resetForm = () => {
    const form = this.getActiveForm();
    if (!form) return { shouldRender: false };

    if (form.type === EXPENSE_FORM_ADD) {
      const currentUserId = state.userId;
      form.reset(currentUserId);
    } else {
      form.reset();
    }

    return { shouldRender: true, form };
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
