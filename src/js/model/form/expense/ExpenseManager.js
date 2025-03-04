import {
  TYPE_EXPENSE,
  EXPENSE_FORM_TYPES,
  EXPENSE_FORM_EDIT,
  EXPENSE_SPLITT_TYPES,
  DEFAULT_EMOJI_EXPENSE,
  EVENT_EXPENSE_EMOJI_EDIT,
} from '../../../util/Config.js';
import state from '../../state/State.js';
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
