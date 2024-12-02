import RepaymentFormState from './RepaymentFormState.js';
import DateState from '../date/DateState.js';
import {
  REPAYMENT_FORM_EDIT,
  VALIDATION_STATUS_VALID,
  VALIDATION_STATUS_INVALID,
  VALIDATION_STATUS_NO_EDIT,
} from '../../../util/Config.js';
import { isNonNegativeInteger } from '../../../util/SplittValidator.js';

class RepaymentFormEditState extends RepaymentFormState {
  #repaymentId;
  #amountEdit;
  #dateEdit;
  #payerEdit;
  #recipientEdit;
  #emojiEdit;
  #noteEdit;
  #fieldValidators;
  #validEdits;
  #invalidEdits;

  constructor() {
    super(REPAYMENT_FORM_EDIT);
    this.#validEdits = new Set();
    this.#invalidEdits = new Set();
    this.#fieldValidators = new Map();
    this.#repaymentId = null;
    this.#initFieldValidators();
    this.clearAll();
  }

  /**
   * Populates the #fieldValidators map with field names and their corresponding validation methods.
   * This method sets up the validation functions for each editable field in the form.
   *
   * @private
   * @returns {void}
   */
  #initFieldValidators = () => {
    this.#fieldValidators.set('amountEdit', this.#validateAmountEdit);
    this.#fieldValidators.set('payerEdit', this.#validatePayerEdit);
    this.#fieldValidators.set('recipientEdit', this.#validateRecipientEdit);
    this.#fieldValidators.set('dateEdit', this.#validateDateEdit);
    this.#fieldValidators.set('emojiEdit', this.#validateEmojiEdit);
    this.#fieldValidators.set('noteEdit', this.#validateNoteEdit);
  };

  /**
   * Clears all edited repayment fields.
   */
  clearAll = () => {
    this.#amountEdit = null;
    this.#dateEdit = null;
    this.#payerEdit = null;
    this.#recipientEdit = null;
    this.#emojiEdit = null;
    this.#noteEdit = undefined;
    this.#validEdits.clear();
    this.#invalidEdits.clear();
    this.#validateForm();
  };

  /**
   * Gets the repayment ID.
   * @returns {bigint|null} The repayment ID or null, if not yet assigned.
   */
  get repaymentId() {
    return this.#repaymentId;
  }

  /**
   * Sets the repayment ID.
   * @param {bigInt} value — Must be a bigint.
   * @throws {Error} If the value is not valid.
   */
  set repaymentId(value) {
    if (typeof value !== 'bigint') {
      throw new Error(
        `Invalid Repayment ID type. Expected 'bigint, Received: ${value} (${typeof value}).`
      );
    }
    this.#repaymentId = value;
  }

  /**
   * Gets the edited repayment amount.
   * @returns {number|null} The edited repayment amount or null.
   */
  get amountEdit() {
    return this.#amountEdit;
  }

  /**
   * Gets the edited repayment date.
   * @returns {DateState|null} The edited repayment date or null.
   */
  get dateEdit() {
    return this.#dateEdit;
  }

  /**
   * Gets the edited payer ID, i.e., who the repayment is from.
   * @returns {bigint|null} The edited payer ID or null.
   */
  get payerEdit() {
    return this.#payerEdit;
  }

  /**
   * Gets the edited recipient ID, i.e., who the repayment is to.
   * @returns {bigint|null} The edited recipient ID or null.
   */
  get recipientEdit() {
    return this.#recipientEdit;
  }

  /**
   * Gets the edited emoji associated with the repayment.
   * @returns {string|null} The edited emoji or null.
   */
  get emojiEdit() {
    return this.#emojiEdit;
  }

  /**
   * Gets the edited repayment note.
   * @returns {string|null} The edited repayment note or null.
   */
  get noteEdit() {
    return this.#noteEdit;
  }

  // Edit: Fields

  /**
   * Edits the repayment amount.
   * @param {number|null} value Must be a positive integer or null.
   * @returns {Object} The response object.
   * @throws {Error} If the value is not a positive integer or null.
   */
  editAmount = value => {
    if (value !== null && !isNonNegativeInteger(value)) {
      throw new Error(
        `Invalid amount: expected a whole positive number, zero, or null. Received: ${value} (type: ${typeof value}).`
      );
    }
    this.#amountEdit = value;
    return this.#processEdit('amountEdit');
  };

  /**
   * Edits the repayment date, setting it as a {@link DateState} object.
   * @param {Date|null} value Must be a Date object or null.
   * @returns {Object} The response object.
   * @throws {Error} If the value is not a Date object or null.
   */
  editDate = value => {
    if (value !== null && !(value instanceof Date)) {
      throw new Error(
        `Invalid date: expected a Date value or null. Received: ${value} (type: ${typeof value}).`
      );
    }
    this.#dateEdit = value !== null ? new DateState(value) : null;
    return this.#processEdit('dateEdit');
  };

  /**
   * Edits the payer ID, i.e. who the repayment is from.
   * @param {bigint|null} value The user's ID as BigInt or null.
   * @returns {Object} The response object.
   * @throws {Error} If the value is not a BigInt or null.
   */
  editPayer = value => {
    this.#validateEditPartyId(value);
    this.#payerEdit = value;
    return this.#processEdit('payerEdit');
  };

  /**
   * Edits the recipient ID, i.e. who the repayment is to.
   * @param {bigint|null} value The user's ID as BigInt or null.
   * @returns {Object} The response object.
   * @throws {Error} If the value is not a BigInt or null.
   */
  editRecipient = value => {
    this.#validateEditPartyId(value);
    this.#recipientEdit = value;
    return this.#processEdit('recipientEdit');
  };

  /**
   * Edits the emoji associated with the repayment.
   * @param {string|null} value The emoji as a string or null.
   * @returns {Object} The response object.
   * @throws {Error} If the emoji is not a string or null.
   */
  editEmoji = value => {
    if (value !== null && typeof value !== 'string') {
      throw new Error(
        `Emoji must be a string or null. Received: ${value} (${typeof value}).`
      );
    }
    this.#emojiEdit = value;
    return this.#processEdit('emojiEdit');
  };

  /**
   * Edits the repayment note.
   * @param {string|null|undefined} value One of:
   *                                      - string not exceeding the length limit set in [TRANSACTION_NOTE_LIMIT]{@link TRANSACTION_NOTE_LIMIT}.
   *                                      - `null` if the edited note is empty
   *                                      - `undefined` to reset the note
   * @returns {Object} The response object.
   * @throws {Error} If the note is invalid.
   */
  editNote = value => {
    if (value !== undefined) this._validateNote(value);
    this.#noteEdit = value;
    return this.#processEdit('noteEdit');
  };

  // Edit: Global

  /**
   * Processes the edit and validates the form.
   * @param {string} fieldName
   * @returns {object} An object containing validation details.
   */
  #processEdit = fieldName => {
    this._validateForSubmission(fieldName);
    return this.#generateEditResponse(fieldName);
  };

  /**
   * Generates a response with the current edit and validation status.
   * @param {string} fieldName
   * @returns {object} An object containing validation details.
   */
  #generateEditResponse = fieldName => {
    const isFieldEdited =
      this.#validEdits.has(fieldName) || this.#invalidEdits.has(fieldName);
    const hasEdits = this.#validEdits.size > 0 || this.#invalidEdits.size > 0;
    const isFormValid = this.isValid;

    return {
      isFieldEdited,
      hasEdits,
      isFormValid,
    };
  };

  // Validation: General

  /**
   * Validates the specified field and the entire form for submission.
   * This method is called whenever a single field is edited to ensure the form is valid for submission.
   *
   * @param {string} fieldName - The name of the field to validate.
   * @returns {void}
   */
  _validateForSubmission = fieldName => {
    if (!fieldName) return;

    const validateField = this.#fieldValidators.get(fieldName);
    if (!validateField) return;

    const isValidField = validateField();
    this.updateFieldValidity(fieldName, isValidField);
    this.#validateForm();
  };

  /**
   * Updates the sets of valid and invalid edits based on the validity of the specified field.
   * @param {string} fieldName - The name of the field being updated.
   * @param {string} validationStatus — The string indicating the field validation status.
   */
  updateFieldValidity = (fieldName, validationStatus) => {
    switch (validationStatus) {
      case VALIDATION_STATUS_VALID:
        this.#validEdits.add(fieldName);
        this.#invalidEdits.delete(fieldName);
        break;
      case VALIDATION_STATUS_INVALID:
        this.#invalidEdits.add(fieldName);
        this.#validEdits.delete(fieldName);
        break;
      case VALIDATION_STATUS_NO_EDIT:
        this.#validEdits.delete(fieldName);
        this.#invalidEdits.delete(fieldName);
        break;
      default:
        throw new Error(`Unknown validation status: ${validationStatus}`);
    }
  };

  /**
   * Validates the form by checking the #validEdits and #invalidEdits sets.
   * The form is considered valid if there is at least one entry in the #validEdits set
   * and if the #invalidEdits set is empty.
   *
   * @returns {void}
   */
  #validateForm = () => {
    this._isValid = this.#validEdits.size > 0 && this.#invalidEdits.size === 0;
  };

  // Validation: Fields

  /**
   * Validates the 'amountEdit' field.
   *
   * @returns {string} - The validation status.
   */
  #validateAmountEdit = () => {
    if (this.#amountEdit === null || this.#amountEdit === this._amount) {
      return VALIDATION_STATUS_NO_EDIT;
    }
    return this.#amountEdit !== 0
      ? VALIDATION_STATUS_VALID
      : VALIDATION_STATUS_INVALID;
  };

  /**
   * Validates the ID to be set for the repayment party, the payer or recipient.
   * @param {bigint|null} value The ID of the repayment party.
   * @throws {Error} If the ID is not a bigint value.
   */
  #validateEditPartyId(value) {
    if (value !== null && typeof value !== 'bigint') {
      throw new Error(
        `Invalid user ID: expected a BigInt or null. Received: ${value} (type: ${typeof value}).`
      );
    }
  }

  /**
   * Validates the edited payer ID.
   * Verifies that it is not the same as the existing payer ID and the recipient ID.
   * @returns {string} The validation status.
   */
  #validatePayerEdit = () => {
    if (this.#payerEdit === null || this.#payerEdit === this._payer) {
      return VALIDATION_STATUS_NO_EDIT;
    }
    return this.#isPartyEditValid(true)
      ? VALIDATION_STATUS_VALID
      : VALIDATION_STATUS_INVALID;
  };

  /**
   * Validates the edited recipient ID.
   * Verifies that it is not the same as the existing recipient ID and the payer ID.
   * @returns {string} The validation status.
   */
  #validateRecipientEdit = () => {
    if (
      this.#recipientEdit === null ||
      this.#recipientEdit === this._recipient
    ) {
      return VALIDATION_STATUS_NO_EDIT;
    }
    return this.#isPartyEditValid(false)
      ? VALIDATION_STATUS_VALID
      : VALIDATION_STATUS_INVALID;
  };

  /**
   * Validates that the edited party ID is not the same as the other party's ID.
   * @param {boolean} isPayerEdit True of the edited party is the payer, false — if it is the recipient.
   * @returns {boolean} True if valid, otherwise false.
   */
  #isPartyEditValid = (isPayerEdit = true) => {
    const editedParty = isPayerEdit ? this.#payerEdit : this.#recipientEdit;

    let partyToCompare;
    if (isPayerEdit) {
      partyToCompare = this.#recipientEdit
        ? this.#recipientEdit
        : this._recipient;
    } else {
      partyToCompare = this.#payerEdit ? this.#payerEdit : this._payer;
    }

    return editedParty !== partyToCompare;
  };

  /**
   * Validates the edited date. Checks that it is not equal to the original date.
   *
   * @returns {string} The validation status.
   */
  #validateDateEdit = () => {
    if (!this.#dateEdit) return VALIDATION_STATUS_NO_EDIT;
    return this.#dateEdit.date.getTime() === this._date.date.getTime()
      ? VALIDATION_STATUS_NO_EDIT
      : VALIDATION_STATUS_VALID;
  };

  /**
   * Validates the edited emoji. Checks that it is not equal to the original emoji.
   *
   * @returns {string} The validation status.
   */
  #validateEmojiEdit = () => {
    if (!this.#emojiEdit) return VALIDATION_STATUS_NO_EDIT;
    return this.#emojiEdit === this._emoji
      ? VALIDATION_STATUS_NO_EDIT
      : VALIDATION_STATUS_VALID;
  };

  /**
   * Validates the edited note. Checks that it is not equal to the original note.
   *
   * @returns {string} The validation status.
   */
  #validateNoteEdit = () => {
    if (this.#noteEdit === undefined) return VALIDATION_STATUS_NO_EDIT;
    return this.#noteEdit === this._note
      ? VALIDATION_STATUS_NO_EDIT
      : VALIDATION_STATUS_VALID;
  };
}

export default new RepaymentFormEditState();
