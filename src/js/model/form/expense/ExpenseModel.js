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
} from '../../../util/Config.js';
import { isEmptyString } from '../../../util/SplittValidator.js';
import expenseManager from './ExpenseManager.js';
import stateManager from '../../state/StateManager.js';
import dateManager from '../date/DateManager.js';
import balanceService from './service/ExpenseBalanceService.js';
import paidByService from './service/PaidByService.js';
import splittService from './service/SplittService.js';
import mathService from '../../util/MathService.js';
import TransactionFormModel from '../common/TransactionFormModel.js';

class ExpenseModel extends TransactionFormModel {
  constructor() {
    super({ manager: expenseManager, transactionType: TYPE_EXPENSE });
  }

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
    const splittViewModel = splittService.prepareViewModel(
      splittData.activeForm
    );
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

  /**
   * Constructs the updated view model after an expense amount change.
   *
   * @param {Object} response - The response object containing form updates.
   * @param {Object} response.form - The updated form after the expense amount change.
   * @param {Object} response.updateResponsePaidBy - The update result from the "Paid By" section.
   * @returns {Object} The structured view model after the amount update.
   * @property {number} amount - The updated expense amount.
   * @property {boolean} isValid - Whether the updated form state is valid.
   * @property {Object} balance - The updated balance information for the current user.
   * @property {Object} paidBy - The updated view model for the "Paid By" section.
   * @property {Object} splitt - The updated view model for the "Splitt" section.
   */
  #prepareViewModelAfterUpdateAmount = response => {
    const { form, updateResponsePaidBy } = response;

    const currentUserId = stateManager.getUserId();
    const groupMembers = stateManager.getMembers();
    const balance = balanceService.getBalance(form, currentUserId);
    const paidByViewModel =
      paidByService.prepareViewModelAfterExpenseAmountUpdate({
        updateResponsePaidBy,
        paidByState: form.paidBy,
        currentUserId,
        groupMembers,
      });
    const splittViewModel = splittService.prepareViewModel(
      form.splitt.activeForm
    );

    return {
      amount: form.amount,
      isValid: form.isValid,
      balance,
      paidBy: paidByViewModel,
      splitt: splittViewModel,
    };
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

  // Public methods: Update

  /**
   * Updates the title of the active form.
   *
   * @param {string} inputTitle - The new title input.
   * @returns {Object} The update response object.
   */
  updateTitle = inputTitle => {
    const processedTitle = this.#processTitleInput(inputTitle);
    return expenseManager.updateTitle(processedTitle);
  };

  /**
   * Processes, updates, and prepares the view model for an expense amount change.
   *
   * @param {string} inputAmount - The raw input amount to process and update.
   * @returns {Object} The updated view model after processing the amount change.
   * @property {number} amount - The updated expense amount.
   * @property {boolean} isValid - Whether the updated form state is valid.
   * @property {Object} balance - The updated balance information for the current user.
   * @property {Object} paidBy - The updated view model for the "Paid By" section.
   * @property {Object} splitt - The updated view model for the "Splitt" section.
   */
  updateAmount = inputAmount => {
    const processedAmount = mathService.processInputAmount(inputAmount);
    const response = expenseManager.updateAmount(processedAmount);
    return this.#prepareViewModelAfterUpdateAmount(response);
  };

  /**
   * Updates the active Splitt type in the expense form and recalculates related values.
   * If the requested type is already active, no changes are made.
   * Otherwise, the corresponding Splitt form is updated, and the necessary values are retrieved.
   *
   * @param {string} type - The new Splitt type to activate. See {@link EXPENSE_SPLITT_TYPES}.
   * @returns {Object} An object containing rendering information and updated values.
   * @property {boolean} shouldRender - `true` if the Splitt type was updated and requires re-rendering, `false` otherwise.
   * @property {Object} [splitt] - The prepared view model for the updated Splitt form.
   * @property {Object} [balance] - The updated balance for the current user.
   * @property {number} [expenseAmount] - The updated total expense amount.
   * @property {boolean} [isValid] - The validity status of the updated expense form.
   */
  updateSplittType = type => {
    const updateResponse = expenseManager.updateSplittType(type);
    if (!updateResponse.isUpdated) {
      return { shouldRender: false };
    }
    const { form } = updateResponse;
    const currentUserId = stateManager.getUserId();
    const splittViewModel = splittService.prepareViewModel(
      form.splitt.activeForm
    );
    const balance = balanceService.getBalance(form, currentUserId);
    return {
      shouldRender: true,
      splitt: splittViewModel,
      balance,
      expenseAmount: form.amount,
      isValid: form.isValid,
    };
  };

  /**
   * Updates the active hidden form type.
   *
   * @param {string|null} type The hidden form element to set as active, or null to deactivate.
   */
  updateActiveHiddenForm = type => {
    expenseManager.setActiveHiddenForm(type);
  };

  // Private Methods

  /**
   * Processes the title input by normalizing empty strings to `null`.
   *
   * @param {string} input - The title input to process.
   * @returns {string|null} The processed title, or `null` if the input is empty.
   */
  #processTitleInput = input => {
    if (isEmptyString(input)) {
      return null;
    }
    return input;
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
