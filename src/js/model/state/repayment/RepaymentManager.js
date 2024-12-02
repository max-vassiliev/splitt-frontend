import state from '../State.js';
import repaymentAPI from '../../repayment/RepaymentAPI.js';
import {
  REPAYMENT_FORM_SETTLE,
  REPAYMENT_FORM_EDIT,
  REPAYMENT_FORM_TYPES,
  DEFAULT_EMOJI_REPAYMENT,
  MODAL_ID_REPAYMENT,
  MODAL_CLOSE_REPAYMENT,
} from '../../../util/Config.js';
import RepaymentFormState from './RepaymentFormState.js';
import Repayment from '../../repayment/Repayment.js';
import eventBus from '../../../util/EventBus.js';

class RepaymentManager {
  init = () => {
    this.#loadDefaultData();
  };

  // Getters and Setters

  /**
   * Retrieves the currently active repayment form.
   *
   * @returns {RepaymentFormState|null} The active repayment form state object or null, if none is selected.
   */
  getActiveForm = () => {
    return state.repaymentForms.activeForm;
  };

  /**
   * Sets the active repayment form based on the provided type.
   *
   * @param {string} formType - The type of the repayment form to set as active.
   *                        Must be one of {@link REPAYMENT_FORM_TYPES}.
   * @throws {Error} Throws an error if the provided type is not valid.
   */
  setActiveForm = formType => {
    this.#validateFormType(formType);
    state.repaymentForms.activeForm = formType;
  };

  /**
   * Retrieves the repayment form of the specified type.
   *
   * @param {string} type - The type of the repayment form to retrieve (e.g., 'add').
   *                        Must be one of {@link REPAYMENT_FORM_TYPES}.
   * @returns {RepaymentFormState} The repayment form object of the specified type.
   * @throws {Error} Throws an error if the provided type is not valid.
   */
  getForm = type => {
    this.#validateFormType(type);
    state.repaymentForms[type];
  };

  /**
   * Updates the active form's emoji field.
   *
   * @param {string} emoji - The new emoji to set for the active form.
   * @fires repaymentFormEmojiEdited - Emits when the emoji is edited in for the "edit" form.
   */
  setActiveFormEmoji = emoji => {
    const form = this.getActiveForm();
    if (form.type === REPAYMENT_FORM_EDIT) {
      const editResponse = form.editEmoji(emoji);
      eventBus.emit('repaymentFormEmojiEdited', editResponse);
    } else {
      state.repaymentForms.activeForm.emoji = emoji;
    }
  };

  /**
   * Gets the currently active hidden form type.
   *
   * @returns {string|null} The active hidden form element or null, if none is set.
   */
  getActiveHiddenForm = () => {
    return state.repaymentForms.activeForm.activeHiddenForm;
  };

  /**
   * Sets the active hidden form.
   *
   * @param {string|null} type The hidden form type to set as active or null to deactivate.
   */
  setActiveHiddenForm = type => {
    if (state.repaymentForms.activeForm) {
      state.repaymentForms.activeForm.activeHiddenForm = type;
    }
  };

  // Update

  /**
   * Updates the party (payer or recipient) for the active form.
   * Delegates to `#editParty()` or `#changeParty()` based on the form type.
   *
   * @param {string} userId - The ID of the user to set as payer or recipient.
   * @param {boolean} [isPayer=true] - Whether the party being updated is the payer.
   * @returns {Object} The response object.
   */
  updateParty = (userId, isPayer = true) => {
    const form = this.getActiveForm();
    return form.type === REPAYMENT_FORM_EDIT
      ? this.#editParty({ userId, isPayer, form })
      : this.#changeParty({ userId, isPayer, form });
  };

  /**
   * Updates the amount for the active form.
   * If the form type is {@link REPAYMENT_FORM_EDIT}, it performs validation and returns a detailed object.
   * Otherwise, it updates the amount directly and returns a simplified object.
   *
   * @param {number} amount - The new amount to set.
   * @returns {Object} The update result object.
   */
  updateAmount = amount => {
    const form = this.getActiveForm();
    const formType = form.type;
    if (formType === REPAYMENT_FORM_EDIT) {
      const { isFormValid, hasEdits, isFieldEdited } = form.editAmount(amount);
      return {
        amount,
        formType,
        isFormValid,
        hasEdits,
        isFieldEdited,
      };
    } else {
      form.amount = amount;
      return { formType, amount, isFormValid: form.isValid };
    }
  };

  /**
   * Updates the date for the active form.
   * If the form type is {@link REPAYMENT_FORM_EDIT}, it performs validation and returns a detailed object.
   * Otherwise, it updates the date directly and returns a simplified object.
   *
   * @param {Date} date The new date to set.
   * @returns {Object} The update result object.
   */
  updateDate = date => {
    const form = this.getActiveForm();
    const formType = form.type;
    if (formType === REPAYMENT_FORM_EDIT) {
      const { isFormValid, hasEdits, isFieldEdited } = form.editDate(date);
      return { formType, isFormValid, hasEdits, isFieldEdited };
    } else {
      form.date = date;
      return { formType };
    }
  };

  /**
   * Updates the note in the active repayment form.
   * Handles both "edit" and non-edit forms and returns the result of the update operation.
   *
   * @param {string|null} note - The processed note to save. Can be null if the note is empty.
   * @returns {Object} The result of the update operation.
   */
  updateNote = note => {
    const form = this.getActiveForm();
    const formType = form.type;
    if (formType === REPAYMENT_FORM_EDIT) {
      const { isFormValid, hasEdits, isFieldEdited } = form.editNote(note);
      return { formType, isFormValid, hasEdits, isFieldEdited };
    } else {
      form.note = note;
      return { formType };
    }
  };

  // Update: Auxiliary Methods

  /**
   * Updates the payer or recipient for Repayment Add and Settle forms.
   *
   * @private
   * @param {Object} params - The parameters for changing the party.
   * @param {string} params.userId - The ID of the user to set as payer or recipient.
   * @param {boolean} params.isPayer - Whether the party being updated is the payer.
   * @param {Object} params.form - The active form.
   * @returns {Object} The response object.
   */
  #changeParty = ({ userId, isPayer, form }) => {
    if (isPayer) {
      form.payer = userId;
    } else {
      form.recipient = userId;
    }
    return { formType: form.type, isFormValid: form.isValid };
  };

  /**
   * Edits the payer or recipient for the Repayment Edit Form.
   *
   * @private
   * @param {Object} params - The parameters for editing the party.
   * @param {string} params.userId - The ID of the user to set as payer or recipient.
   * @param {boolean} params.isPayer - Whether the party being updated is the payer.
   * @param {Object} params.form - The Repayment Edit Form state object.
   * @returns {Object} The response object.
   */
  #editParty = ({ userId, isPayer, form }) => {
    const { isFieldEdited, hasEdits, isFormValid } = isPayer
      ? form.editPayer(userId)
      : form.editRecipient(userId);

    return {
      formType: form.type,
      isPayer,
      isFieldEdited,
      hasEdits,
      isFormValid,
    };
  };

  // Reset

  /**
   * Resets all fields in the Repayment Edit Form to their initial state.
   *
   * @returns {Object} The updated form state after resetting all fields.
   */
  resetAll = () => {
    const form = state.repaymentForms.edit;
    form.clearAll();
    return form;
  };

  /**
   * Resets the amount field in the Repayment Edit Form.
   *
   * @returns {Object} The form status after the field was reset and the original amount.
   * @property {number} amount — The initial amount value.
   * @property {boolean} isFormValid — Whether the form is valid after the reset.
   * @property {boolean} hasEdits — Whether the form has edited fields after the reset.
   * @property {boolean} isFieldEdited — Returns `false` indicating that the reset field does not contain a new value.
   */
  resetAmount = () => {
    const form = state.repaymentForms.edit;
    const { isFormValid, hasEdits, isFieldEdited } = form.editAmount(null);
    const amount = form.amount;
    return { amount, isFormValid, hasEdits, isFieldEdited };
  };

  /**
   * Resets the payer ID in the Repayment Edit Form.
   *
   * @returns {Object} The form status after the field was reset.
   * @property {bigint} payer — The initial payer ID.
   * @property {boolean} isFormValid — Whether the form is valid after the reset.
   * @property {boolean} hasEdits — Whether the form has edited fields after the reset.
   * @property {boolean} isFieldEdited — Returns `false` indicating that the reset field does not contain a new value.
   */
  resetPayer = () => {
    const form = state.repaymentForms.edit;
    const { isFormValid, hasEdits, isFieldEdited } = form.editPayer(null);
    const payer = form.payer;
    return { payer, isFormValid, hasEdits, isFieldEdited };
  };

  /**
   * Resets the recipient ID in the Repayment Edit Form.
   *
   * @returns {Object} The form status after the field was reset.
   * @property {bigint} recipient — The initial recipient ID.
   * @property {boolean} isFormValid — Whether the form is valid after the reset.
   * @property {boolean} hasEdits — Whether the form has edited fields after the reset.
   * @property {boolean} isFieldEdited — Returns `false` indicating that the reset field does not contain a new value.
   */
  resetRecipient = () => {
    const form = state.repaymentForms.edit;
    const { isFormValid, hasEdits, isFieldEdited } = form.editRecipient(null);
    const recipient = form.recipient;
    return { recipient, isFormValid, hasEdits, isFieldEdited };
  };

  /**
   * Resets the date field in the Repayment Edit Form.
   *
   * @returns {Object} The form status after the field was reset.
   * @property {string} date — The initial date value as a string.
   * @property {boolean} isFormValid — Whether the form is valid after the reset.
   * @property {boolean} hasEdits — Whether the form has edited fields after the reset.
   * @property {boolean} isFieldEdited — Returns `false` indicating that the reset field does not contain a new value.
   */
  resetDate = () => {
    const form = state.repaymentForms.edit;
    const { isFormValid, hasEdits, isFieldEdited } = form.editDate(null);
    const date = form.date.string;
    return { date, isFormValid, hasEdits, isFieldEdited };
  };

  /**
   * Resets the emoji field in the Repayment Edit Form.
   *
   * @returns {Object} The form status after the field was reset.
   * @property {string|null} emoji — The initial emoji value, or `null` if no emoji was assigned.
   * @property {boolean} isFormValid — Whether the form is valid after the reset.
   * @property {boolean} hasEdits — Whether the form has edited fields after the reset.
   * @property {boolean} isFieldEdited — Returns `false` indicating that the reset field does not contain a new value.
   */
  resetEmoji = () => {
    const form = state.repaymentForms.edit;
    const { isFormValid, hasEdits, isFieldEdited } = form.editEmoji(null);
    const emoji = form.emoji;
    return { emoji, isFormValid, hasEdits, isFieldEdited };
  };

  /**
   * Resets the note field in the Repayment Edit Form.
   *
   * @returns {Object} The updated state of the note field.
   * @property {string|null} note — The initial note content, or `null` if the note was empty.
   * @property {number} count — The length of the initial note content or 0 if the note was empty.
   * @property {boolean} isFormValid — Whether the form is valid after the reset.
   * @property {boolean} hasEdits — Whether the form has edited fields after the reset.
   * @property {boolean} isFieldEdited — Returns `false` indicating that the reset field does not contain a new value.
   */
  resetNote = () => {
    const form = state.repaymentForms.edit;
    const { isFormValid, hasEdits, isFieldEdited } = form.editNote(undefined);
    const note = form.note;
    const count = note ? note.length : 0;
    return { note, count, isFormValid, hasEdits, isFieldEdited };
  };

  /**
   * Resets the hidden form field for the Repayment Edit Form.
   */
  resetHiddenForm = () => {
    state.repaymentForms.activeForm.activeHiddenForm = null;
  };

  // Load

  /**
   * Loads and populates the settle repayment form for the given party.
   *
   * @param {bigint} partyId - The ID of the selected user that is the payer or recipient.
   * @returns {RepaymentFormState} The populated settle repayment form.
   */
  loadSettleForm = partyId => {
    const userId = state.userId;
    const userBalance = state.balances.get(userId);
    const { amount } = userBalance.details.find(
      detail => detail.userId === partyId
    );
    const form = state.repaymentForms.settle;
    this.#populateSettleForm({ userId, partyId, amount, form });
    this.setActiveForm(REPAYMENT_FORM_SETTLE);
  };

  /**
   * Loads and populates the edit repayment form for the given repayment.
   *
   * @async
   * @param {bigint} repaymentId - The ID of the repayment to be edited.
   * @returns {Promise<void>}
   */
  loadEditForm = async repaymentId => {
    const repayment = await this.#fetchById(repaymentId);
    const form = state.repaymentForms.edit;
    this.#populateEditForm(repayment, form);
    this.setActiveForm(REPAYMENT_FORM_EDIT);
  };

  /**
   * Retrieves the repayment details by ID, either from the cache or by loading new data.
   *
   * @async
   * @param {bigint} repaymentId - The ID of the repayment to retrieve.
   * @returns {Object} The repayment details.
   * @private
   */
  #fetchById = async repaymentId => {
    if (state.transactionsCache.has(repaymentId)) {
      return state.transactionsCache.get(repaymentId);
    }
    return await this.#loadFromAPI(repaymentId);
  };

  // Populate

  /**
   * Populates the Repayment instances with full data retrieved from the API.
   * @param {Repayment} repayment The repayment to populate.
   * @param {Object} fullData The data retrieved from the API.
   */
  populateRepaymentState = (repayment, fullData) => {
    repayment.note = fullData.note;
  };

  /**
   * Populates the settle repayment form with the provided data.
   *
   * @note This method does not set the "isValid" form parameter.
   *
   * @param {Object} params - The parameters for populating the form.
   * @param {bigint} params.userId - The ID of the current user.
   * @param {bigint} params.partyId - The ID of the other party.
   * @param {number} params.amount - The amount to be settled.
   * @param {RepaymentFormState} params.form - The form to be populated.
   */
  #populateSettleForm = ({ userId, partyId, amount, form }) => {
    const isUserPayer = amount < 0;
    form.amount = Math.abs(amount);
    form.payer = isUserPayer ? userId : partyId;
    form.recipient = isUserPayer ? partyId : userId;
    form.emoji = DEFAULT_EMOJI_REPAYMENT;
    form.note = null;
    form.activeHiddenForm = null;
  };

  /**
   * Populates the edit form with the details of a repayment.
   *
   * @param {Object} repayment - The repayment details to populate the form with.
   * @param {Object} editForm - The form object to be populated.
   * @returns {void}
   * @private
   */
  #populateEditForm = (repayment, editForm) => {
    editForm.amount = repayment.amount;
    editForm.date = repayment.date;
    editForm.payer = repayment.payer.id;
    editForm.recipient = repayment.recipient.id;
    editForm.emoji = repayment.emoji;
    editForm.note = repayment.note;
    editForm.repaymentId = repayment.id;
  };

  // API

  /**
   * Loads new repayment details by ID from API and populates the state.
   *
   * @async
   * @param {bigint} repaymentId - The ID of the repayment to load.
   * @returns {Object} The newly loaded repayment details.
   * @private
   */
  #loadFromAPI = async repaymentId => {
    const repayment = state.getTransactionById(repaymentId);
    const groupId = state.group.id;
    const userId = state.userId;
    const fullData = await this.#fetchFromAPI({ repaymentId, groupId, userId });
    this.populateRepaymentState(repayment, fullData);
    state.transactionsCache.set(repaymentId, repayment);
    return repayment;
  };

  /**
   * Fetches repayment data from the API by ID.
   *
   * @async
   * @param {bigint} id - The ID of the repayment to fetch.
   * @returns {Promise<Object>} A promise that resolves to the repayment data.
   * @throws Will throw an error if the API request fails.
   */
  #fetchFromAPI = async ({ repaymentId, groupId, userId }) => {
    try {
      const repaymentData = await repaymentAPI.getById({
        repaymentId,
        groupId,
        userId,
      });
      return repaymentData;
    } catch (error) {
      throw error;
    }
  };

  // Initialize

  /**
   * Initializes the default data and configurations for the repayment form.
   */
  #loadDefaultData = () => {
    this.#loadAddFormDefaultData();
    this.#loadSettleFormDefaultData();
    this.#loadModalCloseEvent();
  };

  /**
   * Initializes the default data and configurations for the add repayment form state.
   */
  #loadAddFormDefaultData = () => {
    const addForm = state.repaymentForms.add;
    addForm.payer = state.userId;
    addForm.emoji = DEFAULT_EMOJI_REPAYMENT;
  };

  /**
   * Initializes the default data and configurations for the settle repayment form state.
   */
  #loadSettleFormDefaultData = () => {
    const settleForm = state.repaymentForms.settle;
    settleForm.emoji = DEFAULT_EMOJI_REPAYMENT;
  };

  /**
   * Registers a custom close event for the repayment modal in the application state.*
   *
   * @private
   */
  #loadModalCloseEvent = () => {
    state.modalCloseEvents.set(MODAL_ID_REPAYMENT, MODAL_CLOSE_REPAYMENT);
  };

  // Validate

  /**
   * Validates the repayment form type.
   * @param {*} type The repayment form type too validate.
   * @throws {Error} If the value is not one of {@link REPAYMENT_FORM_TYPES}.
   */
  #validateFormType = type => {
    if (!REPAYMENT_FORM_TYPES.has(type)) {
      throw new Error(
        `Invalid repayment form type: "${type}" (${typeof type}). Expected one of: ${Array.from(
          REPAYMENT_FORM_TYPES
        ).join(', ')}.`
      );
    }
  };
}

export default new RepaymentManager();
