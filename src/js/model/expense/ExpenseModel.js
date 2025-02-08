import {
  TYPE_EXPENSE,
  EXPENSE_FORM_ADD,
  EXPENSE_FORM_EDIT,
  DEFAULT_AMOUNT,
  USERNAME_OTHER,
  EXPENSE_PAID_BY_EMPTY,
  EXPENSE_PAID_BY_COPAYMENT,
  EXPENSE_PAID_BY_CURRENT_USER,
  EXPENSE_PAID_BY_OTHER_USER,
  EXPENSE_PAID_BY_TYPES,
  EXPENSE_BALANCE_DEFAULT,
  EXPENSE_BALANCE_CHECK_PAID_BY,
  EXPENSE_BALANCE_CHECK_SPLITT,
} from '../../util/Config.js';
import expenseManager from './ExpenseManager.js';
import stateManager from '../state/StateManager.js';
import dateManager from '../state/date/DateManager.js';
import emojiManager from '../emoji/EmojiManager.js';
import balanceService from './service/ExpenseBalanceService.js';
import paidByService from './service/PaidByService.js';
import PaidByState from '../state/expense/paid-by/PaidByState.js';

class ExpenseModel {
  init = () => {
    expenseManager.init();
  };

  // Prepare Form

  /**
   * Prepares the Expense Add Form.
   * Sets the "Add Form" as the active form for Expense.
   * Prepares the view model for rendering.
   *
   * @returns {Object} The view model with rendering properties.
   */
  prepareAddForm = () => {
    const currentActiveForm = expenseManager.getActiveForm();
    if (currentActiveForm && currentActiveForm.type === EXPENSE_FORM_ADD) {
      return { shouldRender: false };
    }
    const shouldCleanup = this.#checkForCleanup(currentActiveForm);
    expenseManager.setActiveForm(EXPENSE_FORM_ADD);
    const addForm = expenseManager.getActiveForm();
    return this.#prepareFormViewModel(addForm, shouldCleanup);
  };

  // Prepare View Model

  /**
   * Prepares the view model for the Expense Form.
   *
   * @param {Object} form - The form object to be prepared.
   * @param {boolean} shouldCleanup — `true` if the form needs to be cleaned up, otherwise `false`.
   * @returns {Object} The view model for the form.
   * @private
   */
  #prepareFormViewModel = (form, shouldCleanup = false) => {
    const {
      type,
      amount,
      emoji,
      note,
      activeHiddenForm,
      paidBy: paidByData,
      splitt: splittData,
      isValid,
    } = form;

    const currentUserId = stateManager.getUserId();
    const groupMembers = stateManager.getMembers();

    const date = this.#prepareViewDate(form.date);
    const noteCount = note ? note.length : 0;
    const shouldRender = true;
    const splittViewModel = splittData.activeForm;
    const balance = balanceService.getBalance(form, currentUserId);
    const paidByViewModel = paidByService.prepareViewModel(
      paidByData,
      currentUserId,
      groupMembers
    );

    return {
      type,
      amount,
      emoji,
      note,
      noteCount,
      date,
      isValid,
      paidBy: paidByViewModel,
      splitt: splittViewModel,
      balance,
      activeHiddenForm,
      shouldRender,
      shouldCleanup,
    };
  };

  /**
   * Gets the date as a string value for the view model.
   *
   * @param {DateState|null} dateState The DateState object containing the date information, or null.
   * @returns {string} The string representation of the date.
   */
  #prepareViewDate = dateState => {
    if (dateState) {
      return dateState.string;
    }
    return dateManager.getToday().string;
  };

  // Public methods: Get

  /**
   * Retrieves the `type` field from the active form if available.
   *
   * @returns {string|null} One of [EXPENSE_FORM_TYPES]{@link EXPENSE_FORM_TYPES} or `null` if active form is not set.
   */
  getActiveFormType = () => {
    return expenseManager.getActiveForm()?.type ?? null;
  };

  /**
   * Retrieves the currently active hidden form.
   *
   * @returns {string|null} The active hidden form type or null, if none is set.
   */
  getActiveHiddenForm = () => {
    return expenseManager.getActiveHiddenForm();
  };

  /**
   * Retrieves the data required to set up the Expense Add Form when the page loads.
   *
   * @returns {Object} An object containing the required properties, primarily user info.
   */
  getAddFormSetupData = () => {
    const users = [...stateManager.getMembers().values()].map(member => ({
      id: member.id,
      name: member.name,
      avatar: member.avatar,
      amount: DEFAULT_AMOUNT,
      share: DEFAULT_AMOUNT,
    }));

    const currentUser = stateManager.getCurrentUser();
    const displaySettings = stateManager.getLocaleAndCurrencySymbol();

    return {
      users,
      currentUser,
      displaySettings,
    };
  };

  /**
   * Retrieves the updated date range and update status for the date input element.
   *
   * @returns {Object} An object containing the following properties:
   *   @property {string} min - The minimum transaction date as a string.
   *   @property {string} max - The maximum transaction date as a string.
   *   @property {boolean} updateDefaultDate - A flag indicating if the default date should be updated to today's date.
   */
  getDateInputUpdateData = () => {
    const {
      min: { string: min },
      max: { string: max },
    } = dateManager.getTransactionDateRange();
    const form = expenseManager.getActiveForm();
    let updateDefaultDate = false;
    if (form && !form.date) {
      updateDefaultDate = true;
    }
    return { min, max, updateDefaultDate };
  };

  // Public methods: Update

  /**
   * Updates the active hidden form type.
   *
   * @param {string|null} type The hidden form element to set as active, or null to deactivate.
   */
  updateActiveHiddenForm = type => {
    expenseManager.setActiveHiddenForm(type);
  };

  // Public methods: Emoji

  /**
   * Activates the emoji field for expenses.
   */
  activateEmojiField = () => {
    emojiManager.setActiveEmojiFieldId(TYPE_EXPENSE);
  };

  /**
   * Deactivates the active emoji field.
   */
  deactivateEmojiField = () => {
    emojiManager.clearActiveEmojiFieldId();
  };

  // Validation

  /**
   * Determines whether the form needs to be cleaned up when rendering.
   *
   * @param {Object|null} currentActiveForm - The currently active form object or null if no form is active.
   * @param {string} currentActiveForm.type - The type of the active form.
   * @returns {boolean} `true` if the active form requires cleanup, otherwise `false`.
   */
  #checkForCleanup = currentActiveForm => {
    return currentActiveForm?.type === EXPENSE_FORM_EDIT;
  };
}

export default new ExpenseModel();
