import {
  TYPE_EXPENSE,
  EXPENSE_FORM_ADD,
  EXPENSE_FORM_EDIT,
  DEFAULT_AMOUNT,
  MIN_EXPENSE_AMOUNT,
  USERNAME_OTHER,
  EXPENSE_PAID_BY_EMPTY,
  EXPENSE_PAID_BY_COPAYMENT,
  EXPENSE_PAID_BY_CURRENT_USER,
  EXPENSE_PAID_BY_OTHER_USER,
  EXPENSE_PAID_BY_TYPES,
  EXPENSE_BALANCE_DEFAULT,
  EXPENSE_BALANCE_CHECK_PAID_BY,
  EXPENSE_BALANCE_CHECK_SPLITT,
  EXPENSE_BALANCE_AMOUNT_BELOW_MIN,
} from '../../../util/Config.js';
import { isEmptyString } from '../../../util/SplittValidator.js';
import expenseManager from './ExpenseManager.js';
import stateManager from '../../state/StateManager.js';
import balanceService from './service/ExpenseBalanceService.js';
import paidByService from './service/PaidByService.js';
import splittService from './service/SplittService.js';
import mathService from '../../util/MathService.js';
import TransactionFormModel from '../common/TransactionFormModel.js';

class ExpenseModel extends TransactionFormModel {
  constructor() {
    super({
      manager: expenseManager,
      transactionType: TYPE_EXPENSE,
      formTypeEdit: EXPENSE_FORM_EDIT,
    });
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
    const shouldCleanup = this._checkForCleanup(currentActiveForm);
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

    const date = this._prepareViewDate(form.date);
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
   * Constructs the updated view model after an expense amount change.
   *
   * @param {Object} response - The response object containing form updates.
   * @param {Object} response.form - The updated form after the expense amount change.
   * @param {Object} response.updateResponsePaidBy - The update result from the "Paid By" section.
   * @param {Object} [response.amountBelowMinimum] - The processed amount, if the amount is below {@link MIN_EXPENSE_AMOUNT}.
   * @returns {Object} The structured view model after the amount update.
   * @property {number} amount - The updated expense amount.
   * @property {boolean} isValid - Whether the updated form state is valid.
   * @property {Object} balance - The updated balance information for the current user.
   * @property {Object} paidBy - The updated view model for the "Paid By" section.
   * @property {Object} splitt - The updated view model for the "Splitt" section.
   */
  #prepareViewModelAfterUpdateAmount = response => {
    const { form, updateResponsePaidBy, amountBelowMinimum } = response;

    const currentUserId = stateManager.getUserId();
    const groupMembers = stateManager.getMembers();

    const amount = amountBelowMinimum ? amountBelowMinimum : form.amount;

    const balance = amountBelowMinimum
      ? { status: EXPENSE_BALANCE_AMOUNT_BELOW_MIN }
      : balanceService.getBalance(form, currentUserId);

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
      amount,
      isValid: form.isValid,
      balance,
      paidBy: paidByViewModel,
      splitt: splittViewModel,
    };
  };

  // Update: Main Form

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
    if (processedAmount < MIN_EXPENSE_AMOUNT) {
      return this.#updateAmountBelowMinimum(processedAmount);
    }
    const response = expenseManager.updateAmount(processedAmount);
    return this.#prepareViewModelAfterUpdateAmount(response);
  };

  /**
   * Handles the amount update when the processed amount is below the minimum allowed.
   *
   * @param {number} amount - The invalid amount entered by the user.
   * @returns {Object} The updated view model, with the recieved amount.
   */
  #updateAmountBelowMinimum = amount => {
    const response = expenseManager.updateAmount(DEFAULT_AMOUNT);
    response.amountBelowMinimum = amount;
    return this.#prepareViewModelAfterUpdateAmount(response);
  };

  // Update: Paid By

  /**
   * Updates the payer for a specific Paid By entry.
   *
   * @param {number} entryId - The ID of the entry to update.
   * @param {bigint} newPayerId - The ID of the new payer.
   * @returns {Object} The updated view model containing relevant state data.
   */
  updatePayer = (entryId, newPayerId) => {
    const response = expenseManager.updatePayer(entryId, newPayerId);
    const avatar = stateManager.getMemberById(response.addedUserId).avatar;
    const groupMembers = stateManager.getMembers();
    const currentUserId = stateManager.getUserId();
    const form = expenseManager.getActiveForm();
    const balance = balanceService.getBalance(form, currentUserId);

    return paidByService.prepareViewModelAfterUpdatePayer({
      ...response,
      entryId,
      groupMembers,
      currentUserId,
      avatar,
      balance,
    });
  };

  /**
   * Adds a new Paid By entry to the expense form.
   * Ensures that the number of entries does not exceed the number of group members.
   *
   * @returns {Object} The view model for rendering.
   */
  addPaidByEntry = () => {
    const form = expenseManager.getActiveForm();
    const groupMembers = stateManager.getMembers();

    if (form.paidBy.entries.size >= groupMembers.size) {
      console.warn('Paid By entries limit exceeded.');
      return { shouldRender: false };
    }

    const response = expenseManager.addPaidByEntry();

    return paidByService.prepareViewModelAfterAddPayerEntry({
      ...response,
      groupMembers,
    });
  };

  // Update: Splitt

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

  // Public methods: Get

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
}

export default new ExpenseModel();
