import DateState from '../date/DateState.js';
import {
  REPAYMENT_FORM_TYPES,
  REPAYMENT_HIDDEN_FORM_TYPES,
  TRANSACTION_NOTE_LIMIT,
} from '../../../util/Config.js';
import {
  isNonNegativeInteger,
  isNonEmptyStringOrNull,
} from '../../../util/SplittValidator.js';

class RepaymentFormState {
  _type;
  _amount;
  _date;
  _payer;
  _recipient;
  _emoji;
  _note;
  _activeHiddenForm;
  _isValid;

  constructor(type) {
    this.type = type;
    this._amount = 0;
    this._date = null;
    this._payer = null;
    this._recipient = null;
    this._note = null;
    this._activeHiddenForm = null;
    this._isValid = false;
  }

  /**
   * Gets the type of the active hidden form, one of {@link REPAYMENT_HIDDEN_FORM_TYPES}, or null.
   * @returns {string|null} The form type or null, if no form is assigned.
   */
  get activeHiddenForm() {
    return this._activeHiddenForm;
  }

  /**
   * Sets the type of the active hidden form.
   * @param {string|null} value The form type to set as active or "null" to deactivate.
   * @throws {Error} If the form type is invalid.
   * @see {@link REPAYMENT_HIDDEN_FORM_TYPES} for valid types.
   */
  set activeHiddenForm(value) {
    if (value === null) {
      this._activeHiddenForm = value;
      return;
    }
    if (!REPAYMENT_HIDDEN_FORM_TYPES.has(value)) {
      const validTypes = [...REPAYMENT_HIDDEN_FORM_TYPES].join(', ');
      throw new Error(
        `Invalid form type: ${value} (${typeof value}). Expected one of: ${validTypes}.`
      );
    }
    this._activeHiddenForm = value;
  }

  /**
   * Gets the repayment form type.
   * @returns {string} The form type.
   */
  get type() {
    return this._type;
  }

  /**
   * Sets the repayment form type.
   * @param {string} value Must be a string defined in [REPAYMENT_FORM_TYPES]{@link REPAYMENT_FORM_TYPES}.
   */
  set type(value) {
    this.#validateType(value);
    this._type = value;
  }

  /**
   * Gets the repayment amount.
   * @returns {number} The repayment amount.
   */
  get amount() {
    return this._amount;
  }

  /**
   * Sets the repayment amount.
   * @param {number} value Must be a positive integer.
   * @throws {Error} If the value is not a positive integer.
   */
  set amount(value) {
    if (!isNonNegativeInteger(value)) {
      throw new Error(
        `Invalid amount: expected a whole positive number or zero. Received: ${value} (type: ${typeof value}).`
      );
    }
    this._amount = value;
    this._validateForSubmission();
  }

  /**
   * Gets the repayment date.
   * @returns {DateState|null} The repayment date or null, if not yet set.
   */
  get date() {
    return this._date;
  }

  /**
   * Sets the repayment date as a {@link DateState} object.
   * @param {Date} value — Must be a Date object.
   * @throws {Error} If the value is not a Date object.
   */
  set date(value) {
    if (!(value instanceof Date)) {
      throw new Error(
        `Invalid date: expected a Date value. Received: ${value} (type: ${typeof value}).`
      );
    }
    this._date = new DateState(value);
  }

  /**
   * Gets the payer ID, i.e. who the repayment is from.
   * @returns {bigint} The payer ID.
   */
  get payer() {
    return this._payer;
  }

  /**
   * Sets the payer ID, i.e. who the repayment is from.
   * @param {bigint} value The user's ID.
   */
  set payer(value) {
    this.#validatePartyId(value);
    this._payer = value;
    this._validateForSubmission();
  }

  /**
   * Gets the recipient ID, i.e. who the repayment is to.
   * @returns {bigint} The recipient ID.
   */
  get recipient() {
    return this._recipient;
  }

  /**
   * Sets the recipient ID, i.e. who the repayment is to.
   * @param {bigint} value The user's ID.
   */
  set recipient(value) {
    this.#validatePartyId(value);
    this._recipient = value;
    this._validateForSubmission();
  }

  /**
   * Gets the emoji associated with the repayment.
   * @returns {string|null} The emoji or null.
   */
  get emoji() {
    return this._emoji;
  }

  /**
   * Sets the emoji associated with the repayment.
   * @param {string|null} value The emoji as a string or null.
   * @throws {Error} If the emoji is not valid.
   */
  set emoji(value) {
    if (value !== null && typeof value !== 'string') {
      throw new Error(
        `Emoji must be a string or null. Received: ${value} (${typeof value})`
      );
    }
    this._emoji = value;
  }

  /**
   * Gets the repayment note.
   * @returns {string|null} The repayment note or null.
   */
  get note() {
    return this._note;
  }

  /**
   * Sets the repayment note.
   * @param {string|null} value Null or a string not exceeding the length limit set in {@link TRANSACTION_NOTE_LIMIT}.
   */
  set note(value) {
    this._validateNote(value);
    this._note = value;
  }

  /**
   * Gets the "isValid" flag, which shows if the form is ready to be submitted.
   * @returns {boolean} "True" if valid or "false" if not.
   */
  get isValid() {
    return this._isValid;
  }

  // Validation

  _validateForSubmission = () => {
    this._isValid =
      this._amount > 0 &&
      this._payer !== null &&
      this._recipient !== null &&
      this._payer !== this._recipient;
  };

  /**
   * Validates the repayment form type.
   * @param {string} type Must be a string defined in [REPAYMENT_FORM_TYPES]{@link REPAYMENT_FORM_TYPES}
   * @throws {Error} If the incoming type is not one of the valid strings.
   * @see {@link REPAYMENT_FORM_TYPES}
   */
  #validateType(type) {
    if (!REPAYMENT_FORM_TYPES.has(type)) {
      const validTypes = [...REPAYMENT_FORM_TYPES].join(', ');
      throw new Error(
        `Invalid Repayment Form type: ${type} (${typeof type}). Expected one of the following types: ${validTypes}.`
      );
    }
  }

  /**
   * Validates the ID to be set for the repayment party, the payer or recipient.
   * @param {bigint} value The ID of the repayment party.
   * @throws {Error} If the ID is not a bigint value.
   */
  #validatePartyId(value) {
    if (typeof value !== 'bigint') {
      throw new Error(
        `Invalid user ID: expected a BigInt. Received: ${value} (type: ${typeof value}).`
      );
    }
  }

  /**
   * Validates the note value.
   * @param {string|null} value Null or a non-empty string not exceeding the length set in [TRANSACTION_NOTE_LIMIT]{@link TRANSACTION_NOTE_LIMIT}.
   * @throws {Error} If the received value is not null, not a non-empty string, or exceeds the length limit.
   */
  _validateNote(value) {
    if (!isNonEmptyStringOrNull(value)) {
      throw new Error(
        `Invalid note. Expected a non-empty string or null. Received: ${value} (${typeof value}).`
      );
    }
    if (typeof value === 'string' && value.length > TRANSACTION_NOTE_LIMIT) {
      throw new Error(
        `Invalid note length. Expected a string with a maximum of ${TRANSACTION_NOTE_LIMIT} characters. Received a string of ${value.length} characters: ${value}.`
      );
    }
  }
}

export default RepaymentFormState;
