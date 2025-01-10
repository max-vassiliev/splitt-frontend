import {
  EXPENSE_FORM_TYPES,
  EXPENSE_HIDDEN_FORM_TYPES,
  TRANSACTION_TITLE_LIMIT,
  TRANSACTION_NOTE_LIMIT,
} from '../../../util/Config.js';
import {
  isNonEmptyStringOrNull,
  isNonNegativeInteger,
  isNonEmptyString,
  isPositiveInteger,
} from '../../../util/SplittValidator.js';
import PaidByState from './paid-by/PaidByState.js';
import SplittCollection from './splitt/SplittCollection.js';
import SplittState from './splitt/SplittState.js';
import DateState from '../date/DateState.js';

class ExpenseFormState {
  _type;
  _title;
  _amount;
  _isAmountBelowMin;
  _date;
  _emoji;
  _paidBy;
  _splitt;
  _note;
  _activeHiddenForm;
  _isValid;

  constructor(type) {
    this.type = type;
    this._title = null;
    this._amount = 0;
    this._isAmountBelowMin = false;
    this._date = null;
    this._paidBy = new PaidByState();
    this._splitt = new SplittCollection();
    this._note = null;
    this._activeHiddenForm = null;
    this._isValid = false;
  }

  /**
   * Gets the type of the active hidden form, one of {@link EXPENSE_HIDDEN_FORM_TYPES}, or null.
   * @returns {string|null} The form type or null, if no form is assigned.
   */
  get activeHiddenForm() {
    return this._activeHiddenForm;
  }

  /**
   * Sets the type of the active hidden form.
   * @param {string|null} value The form type to set as active or "null" to deactivate.
   * @throws {Error} If the form type is invalid.
   * @see {@link EXPENSE_HIDDEN_FORM_TYPES} for valid types.
   */
  set activeHiddenForm(value) {
    if (value === null) {
      this._activeHiddenForm = value;
      return;
    }
    if (!EXPENSE_HIDDEN_FORM_TYPES.has(value)) {
      const validTypes = [...EXPENSE_HIDDEN_FORM_TYPES].join(', ');
      throw new Error(
        `Invalid form type: ${value} (${typeof value}). Expected one of: ${validTypes}.`
      );
    }
    this._activeHiddenForm = value;
  }

  /**
   * Gets the expense form type.
   * @returns {string} The form type.
   */
  get type() {
    return this._type;
  }

  /**
   * Sets the expense form type.
   * @param {string} value Must be a string defined in [EXPENSE_FORM_TYPES]{@link EXPENSE_FORM_TYPES}.
   */
  set type(value) {
    this.#validateType(value);
    this._type = value;
  }

  /**
   * Gets the expense title.
   * @returns {string|null} The expense title or null.
   */
  get title() {
    return this._title;
  }

  /**
   * Sets the expense title.
   * @param {string|null} value Null or a string not exceeding the length limit set in [TRANSACTION_TITLE_LIMIT]{@link TRANSACTION_TITLE_LIMIT}.
   */
  set title(value) {
    this._validateString({
      value,
      field: 'title',
      limit: TRANSACTION_TITLE_LIMIT,
    });
    this._title = value;
  }

  /**
   * Gets the expense amount.
   * @returns {number} The expense amount.
   */
  get amount() {
    return this._amount;
  }

  /**
   * Sets the expense amount.
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
  }

  /**
   * Gets the flag marking that the expense amount is below minimum.
   * @returns {boolean} `true` if the entered amount is below minimum, otherwise `false`.
   */
  get isAmountBelowMin() {
    return this._isAmountBelowMin;
  }

  /**
   * Sets the flag marking that the entered amount was below the minimum.
   * @param {boolean} value Must be a boolean.
   * @throws {Error} If the value is not a boolean.
   */
  set isAmountBelowMin(value) {
    if (typeof value !== 'boolean') {
      throw new TypeError(
        `Invalid flag for 'isAmountBelowMin'. Expected a boolean. Received: ${value} (${typeof value}).`
      );
    }
    this._isAmountBelowMin = value;
  }

  /**
   * Gets the expense date.
   * @returns {DateState|null} The expense date or null, if not yet set.
   */
  get date() {
    return this._date;
  }

  /**
   * Sets the expense date as a {@link DateState} object.
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
   * Gets the emoji associated with the expense.
   * @returns {string|null} The emoji or null.
   */
  get emoji() {
    return this._emoji;
  }

  /**
   * Sets the emoji associated with the expense.
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
   * Gets the "paid by" parameters of the current expense form.
   * @returns {PaidByState} The "paid by" state.
   */
  get paidBy() {
    return this._paidBy;
  }

  /**
   * Gets the "splitt" parameters of the current expense form.
   * @returns {SplittCollection} The "splitt" state.
   */
  get splitt() {
    return this._splitt;
  }

  /**
   * Gets the currently active Splitt Form state.
   * @returns {SplittState} The Splitt Form state.
   */
  getActiveSplitt = () => {
    return this._splitt.activeForm;
  };

  /**
   * Gets the expense note.
   * @returns {string|null} The expense note or null.
   */
  get note() {
    return this._note;
  }

  /**
   * Sets the expense note.
   * @param {string|null} value Null or a string not exceeding the length limit set in [TRANSACTION_NOTE_LIMIT]{@link TRANSACTION_NOTE_LIMIT}.
   */
  set note(value) {
    this._validateString({
      value,
      field: 'note',
      limit: TRANSACTION_NOTE_LIMIT,
    });
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

  validateForSubmission = () => {
    this._isValid =
      this._title !== null &&
      isPositiveInteger(this._amount) &&
      this._paidBy.isValid &&
      this._splitt.activeForm?.isValid;
  };

  /**
   * Validates the expense form type.
   * @param {string} type Must be a string defined in [EXPENSE_FORM_TYPES]{@link EXPENSE_FORM_TYPES}.
   * @throws {Error} If the incoming type is not one of the valid strings.
   * @see {@link EXPENSE_FORM_TYPES}
   */
  #validateType(type) {
    if (!EXPENSE_FORM_TYPES.has(type)) {
      const validTypes = [...EXPENSE_FORM_TYPES].join(', ');
      throw new Error(
        `Invalid Expense Form type: ${type} (${typeof type}). Expected one of the following types: ${validTypes}.`
      );
    }
  }

  /**
   * Validates a string value (title or note).
   * @param {Object} params The string parameters.
   * @param {string|null} params.value Null or a non-empty string.
   * @param {string} params.field The field name ("title" or "note").
   * @param {number} params.limit The character limit of the string. Expected one of:
   *                                - [TRANSACTION_TITLE_LIMIT]{@link TRANSACTION_TITLE_LIMIT}
   *                                - [TRANSACTION_NOTE_LIMIT]{@link TRANSACTION_NOTE_LIMIT}
   * @throws {Error} If the received value is not null, not a non-empty string, or exceeds the length limit.
   */
  _validateString({ value, field, limit }) {
    if (!isNonEmptyStringOrNull(value)) {
      throw new Error(
        `Invalid ${field}. Expected a non-empty string or null. Received: ${value} (${typeof value}).`
      );
    }
    if (typeof value === 'string' && value.length > limit) {
      throw new Error(
        `Invalid ${field} length. Expected a string with a maximum of ${limit} characters. Received a string of ${value.length} characters: ${value}.`
      );
    }
  }
}

export default ExpenseFormState;
