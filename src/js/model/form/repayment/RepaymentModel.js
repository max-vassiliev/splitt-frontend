import repaymentManager from './RepaymentManager.js';
import stateManager from '../../state/StateManager.js';
import {
  TYPE_REPAYMENT,
  REPAYMENT_FORM_ADD,
  REPAYMENT_FORM_EDIT,
} from '../../../util/Config.js';
import mathService from '../../util/MathService.js';
import TypeParser from '../../../util/TypeParser.js';
import TransactionFormModel from '../common/TransactionFormModel.js';

class RepaymentModel extends TransactionFormModel {
  constructor() {
    super({
      manager: repaymentManager,
      transactionType: TYPE_REPAYMENT,
      formTypeEdit: REPAYMENT_FORM_EDIT,
    });
  }

  init = () => {
    repaymentManager.init();
  };

  // Prepare Form

  /**
   * Prepares the Repayment Add Form by setting it as the active form if it's not already active.
   *
   * @returns {Object} An object indicating whether the form should be rendered.
   */
  prepareAddForm = () => {
    const currentActiveForm = repaymentManager.getActiveForm();
    if (currentActiveForm && currentActiveForm.type === REPAYMENT_FORM_ADD) {
      return { shouldRender: false };
    }
    const shouldCleanup = this._checkForCleanup(currentActiveForm);
    repaymentManager.setActiveForm(REPAYMENT_FORM_ADD);
    const addForm = repaymentManager.getActiveForm();
    return this.#prepareFormViewModel(addForm, shouldCleanup);
  };

  /**
   * Prepares the Repayment Settle Form by loading the form data and setting it as the active form.
   *
   * @param {string} selectedUserId - The ID of the user to settle with.
   * @returns {Object} An object representing the form's view model.
   */
  prepareSettleForm = selectedUserId => {
    const currentActiveForm = repaymentManager.getActiveForm();
    const shouldCleanup = this._checkForCleanup(currentActiveForm);
    const partyId = TypeParser.parseStringToBigInt(selectedUserId);
    repaymentManager.loadSettleForm(partyId);
    const settleForm = repaymentManager.getActiveForm();
    return this.#prepareFormViewModel(settleForm, shouldCleanup);
  };

  /**
   * Prepares the Repayment Edit Form by loading the specified repayment data and setting it as the active form.
   *
   * @async
   * @param {string} selectedRepaymentId - The ID of the repayment to edit.
   * @returns {Promise<Object>} A promise that resolves to an object representing the form's view model.
   *                            Includes a flag `shouldRender` set to `false` if the form is already active with the same repayment ID.
   */
  prepareEditForm = async selectedRepaymentId => {
    const repaymentId = TypeParser.parseStringToBigInt(selectedRepaymentId);
    const currentActiveForm = repaymentManager.getActiveForm();
    if (
      currentActiveForm &&
      currentActiveForm.type === REPAYMENT_FORM_EDIT &&
      currentActiveForm.repaymentId === repaymentId
    ) {
      return { shouldRender: false };
    }
    const shouldCleanup = this._checkForCleanup(currentActiveForm);
    await repaymentManager.loadEditForm(repaymentId);
    const editForm = repaymentManager.getActiveForm();
    return this.#prepareFormViewModel(editForm, shouldCleanup);
  };

  // Prepare View Model

  /**
   * Prepares the view model for the Repayment Forms.
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
      payer,
      recipient,
      emoji,
      note,
      activeHiddenForm,
      isValid,
    } = form;
    const date = this._prepareViewDate(form.date);
    const noteCount = note ? note.length : 0;
    const shouldRender = true;
    return {
      shouldRender,
      shouldCleanup,
      type,
      amount,
      date,
      emoji,
      payer,
      recipient,
      note,
      noteCount,
      activeHiddenForm,
      isValid,
    };
  };

  // Update: Main Form

  /**
   * Updates the party (payer or recipient) in the active form and validates the form.
   *
   * @param {string} id - The ID of the user to be set as the payer or recipient.
   * @param {boolean} [isPayer=true] - Flag indicating whether the user is a payer. Defaults to true.
   * @returns {Object} The response object.
   * @property {boolean} isFormValid - The validity of the form after the update.
   */
  updateParty = (id, isPayer = true) => {
    const userId = TypeParser.parseStringToBigInt(id);
    return repaymentManager.updateParty(userId, isPayer);
  };

  /**
   * Updates the amount in the active form and validates the form.
   *
   * @param {string} inputAmount - The amount string to be set in the form.
   * @returns {Object} An object containing the processed amount and the validity of the form after the update.
   * @property {number} processedAmount - The processed amount after input processing.
   * @property {boolean} isFormValid - The validity of the form after the update.
   */
  updateAmount = inputAmount => {
    const processedAmount = mathService.processInputAmount(inputAmount);
    return repaymentManager.updateAmount(processedAmount);
  };

  // Reset (Submit Demo)

  /**
   * Resets the currently active repayment form
   * and prepares the corresponding view model for rendering.
   *
   * @returns {Object} The response view model.
   * @property {boolean} shouldRender Indicates whether the form should be rendered.
   * @property {Object} [viewModel] The prepared view model for the form, if rendering is required.
   */
  resetForm = () => {
    const { shouldRender, form } = repaymentManager.resetForm();
    if (!shouldRender) return { shouldRender };
    const shouldCleanup = this._checkForCleanup(form);
    return this.#prepareFormViewModel(form, shouldCleanup);
  };

  // Reset

  /**
   * Resets all fields in the Repayment Edit Form to their initial state.
   *
   * @returns {Object} The updated form state after resetting all fields.
   */
  resetAll = () => {
    const clearedForm = repaymentManager.resetAll();
    return this.#prepareFormViewModel(clearedForm);
  };

  /**
   * Resets the amount field in the Repayment Edit Form to its original value.
   *
   * @returns {Object} An object containing the original amount and related form metadata.
   */
  resetAmount = () => {
    return repaymentManager.resetAmount();
  };

  /**
   * Resets the payer ID in the Repayment Edit Form to its original value.
   *
   * @returns {Object} An object containing the original payer ID and related form metadata.
   */
  resetPayer = () => {
    return repaymentManager.resetPayer();
  };

  /**
   * Resets the recipient ID in the Repayment Edit Form to its original value.
   *
   * @returns {Object} An object containing the original recipient ID and related form metadata.
   */
  resetRecipient = () => {
    return repaymentManager.resetRecipient();
  };

  /**
   * Resets the date field in the Repayment Edit Form to its original value.
   *
   * @returns {Object} An object containing the original date string and related form metadata.
   */
  resetDate = () => {
    return repaymentManager.resetDate();
  };

  /**
   * Resets the emoji field in the Repayment Edit Form to its original value.
   *
   * @returns {Object} An object containing the original emoji value (emoji or null) and related form metadata.
   */
  resetEmoji = () => {
    return repaymentManager.resetEmoji();
  };

  /**
   * Resets the note field in the Repayment Edit Form to its original value.
   *
   * @returns {Object} An object containing the original note and related form metadata.
   */
  resetNote = () => {
    return repaymentManager.resetNote();
  };

  /**
   * Resets any hidden form field in the Repayment Edit Form.
   */
  resetHiddenForm = () => {
    repaymentManager.resetHiddenForm();
  };

  // Public methods: Get

  /**
   * Collects data required for rendering the <select> elements of the Repayment Form.
   *
   * @returns {Object} An object containing:
   * @property {number|BigInt} currentUserId — The ID of the current user.
   * @property {Array<Object>} members — An array of member objects, where each object has:
   *    @property {number|BigInt} id — The ID of the member.
   *    @property {string} name — The name of the member.
   */
  getUserSelectOptions = () => {
    const members = [...stateManager.getMembers().values()].map(member => ({
      id: member.id,
      name: member.name,
    }));
    const currentUserId = stateManager.getUserId();
    return { currentUserId, members };
  };
}

export default new RepaymentModel();
