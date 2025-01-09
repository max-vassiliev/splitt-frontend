import repaymentManager from '../state/repayment/RepaymentManager.js';
import emojiManager from '../emoji/EmojiManager';
import dateManager from '../state/date/DateManager.js';
import stateManager from '../state/StateManager.js';
import formService from '../util/TransactionFormService.js';
import {
  TYPE_REPAYMENT,
  REPAYMENT_FORM_ADD,
  REPAYMENT_FORM_EDIT,
} from '../../util/Config.js';
import { validateDate } from '../../util/SplittValidator.js';
import mathService from '../util/MathService.js';
import DateState from '../state/date/DateState.js';
import TypeParser from '../util/TypeParser.js';

class RepaymentModel {
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
    repaymentManager.setActiveForm(REPAYMENT_FORM_ADD);
    const addForm = repaymentManager.getActiveForm();
    return this.#prepareFormViewModel(addForm);
  };

  /**
   * Prepares the Repayment Settle Form by loading the form data and setting it as the active form.
   *
   * @param {string} selectedUserId - The ID of the user to settle with.
   * @returns {Object} An object representing the form's view model.
   */
  prepareSettleForm = selectedUserId => {
    const partyId = TypeParser.parseStringToBigInt(selectedUserId);
    repaymentManager.loadSettleForm(partyId);
    const settleForm = repaymentManager.getActiveForm();
    return this.#prepareFormViewModel(settleForm);
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
    await repaymentManager.loadEditForm(repaymentId);
    const editForm = repaymentManager.getActiveForm();
    return this.#prepareFormViewModel(editForm);
  };

  // Prepare View Model

  /**
   * Prepares the view model for the Repayment Forms.
   *
   * @param {Object} form - The form object to be prepared.
   * @returns {Object} The view model for the form.
   * @private
   */
  #prepareFormViewModel = form => {
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
    const date = this.#prepareViewDate(form.date);
    const noteCount = note ? note.length : 0;
    const shouldRender = true;
    return {
      shouldRender,
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

  /**
   * Gets the date as a string value for the view model.
   *
   * @param {DateState|null} dateState - The DateState object containing the date information, or null.
   * @returns {string} The string representation of the date.
   */
  #prepareViewDate = dateState => {
    if (dateState) {
      return dateState.string;
    }
    return dateManager.getToday().string;
  };

  // Public methods: Update

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

  /**
   * Updates the date in the active form after validating the input date string.
   *
   * @param {string} dateInput The date string to be set in the form.
   * @returns {Object} The response object.
   */
  updateDate = dateInput => {
    const date = new Date(dateInput);
    this.#validateInputDate(date);
    return repaymentManager.updateDate(date);
  };

  /**
   * Updates the note in the active form and returns instructions for rendering.
   * Processes the input note to ensure it meets validation criteria.
   * If the note exceeds the character limit, no changes are made to the form.
   *
   * @param {string} noteInput - The note string to be set in the form. Can be an empty string or contain whitespace.
   * @returns {Object} - The validation result object containing the following properties:
   *   @property {boolean} isEmpty - Indicates if the input is an empty string or contains only whitespace.
   *   @property {boolean} shouldClear - Indicates if the input should be cleared.
   *   @property {number} count - The number of characters in the input.
   *   @property {boolean} isAboveLimit - Indicates if the number of characters exceeds the limit.
   */
  updateNote = noteInput => {
    const validationResult = formService.processNoteInput(noteInput);
    if (validationResult.isAboveLimit) return validationResult;
    const noteToSave = validationResult.isEmpty ? null : noteInput;
    const updateResult = repaymentManager.updateNote(noteToSave);
    return { ...validationResult, ...updateResult };
  };

  /**
   * Updates the active hidden form type.
   *
   * @param {string|null} type The hidden form element to set as active, or null to deactivate.
   */
  updateActiveHiddenForm = type => {
    repaymentManager.setActiveHiddenForm(type);
  };

  // Public methods: Reset

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
    const currentUserId = stateManager.getCurrentUser().id;
    return { currentUserId, members };
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
    const form = repaymentManager.getActiveForm();
    let updateDefaultDate = false;
    if (form && !form.date) {
      updateDefaultDate = true;
    }
    return { min, max, updateDefaultDate };
  };

  /**
   * Retrieves the `type` field from the active form if available.
   *
   * @returns {string|null} One of [REPAYMENT_FORM_TYPES]{@link REPAYMENT_FORM_TYPES} or `null` if active form is not set.
   */
  getActiveFormType = () => {
    return repaymentManager.getActiveForm()?.type ?? null;
  };

  /**
   * Retrieves the currently active hidden form.
   *
   * @returns {string|null} The active hidden form type or null, if none is set.
   */
  getActiveHiddenForm = () => {
    return repaymentManager.getActiveHiddenForm();
  };

  // Public methods: Emoji

  /**
   * Activates the emoji field for repayments.
   */
  activateEmojiField = () => {
    emojiManager.setActiveEmojiFieldId(TYPE_REPAYMENT);
  };

  /**
   * Deactivates the active emoji field.
   */
  deactivateEmojiField = () => {
    emojiManager.clearActiveEmojiFieldId();
  };

  // Validation

  /**
   * Validates the input date within the allowed date range.
   *
   * @param {Date} inputDate - The date to be validated.
   * @private
   */
  #validateInputDate = inputDate => {
    const {
      min: { date: minDate },
      max: { date: maxDate },
    } = dateManager.getTransactionDateRange();
    validateDate(inputDate, maxDate, minDate);
  };
}

export default new RepaymentModel();
