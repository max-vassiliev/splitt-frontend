import { isNonNegativeInteger } from '../../../../util/SplittValidator';
import IDGenerator from './PaidByIDGenerator';

class PaidByEntry {
  #entryId;
  #userId;
  #amount;
  #isDefault;

  /**
   * Creates a new ExpensePaidByEntry instance.
   *
   * @param {number} entryId - The ID of the entry. Must be a non-negative integer or null.
   */
  constructor(entryId = null) {
    this.#validateId(entryId);
    this.#entryId = entryId ? entryId : this.#generateID();
    this.#userId = null;
    this.#amount = 0;
    this.#isDefault = false;
  }

  /**
   * Resets the entry by clearing the user ID and setting the amount to zero.
   */
  clear = () => {
    this.#userId = null;
    this.#amount = 0;
  };

  /**
   * Generates the Paid By Entry ID.
   * @returns {number} The Entry ID.
   */
  #generateID = () => {
    return IDGenerator.generateID();
  };

  /**
   * Gets the ID of this Paid By Entry.
   *
   * @returns {number} The ID of the entry.
   */
  get entryId() {
    return this.#entryId;
  }

  /**
   * Gets the user ID associated with the "paid by" entry.
   *
   * @returns {bigint | null} The user ID of the payer or `null` if unassigned.
   */
  get userId() {
    return this.#userId;
  }

  /**
   * Sets the user ID for the "paid by" entry.
   *
   * @param {bigint | null} value - The ID of the user who paid the expense, or `null` if no user is assigned.
   * @throws {Error} Throws if the value is not `null` or a `bigint`.
   */
  set userId(value) {
    if (value !== null && typeof value !== 'bigint') {
      throw new Error(
        `userId must be either null or a bigint. Received: ${value} (${typeof value}).`
      );
    }
    this.#userId = value;
  }

  /**
   * Gets the amount paid for this expense entry.
   *
   * @returns {number} The non-negative integer amount paid.
   */
  get amount() {
    return this.#amount;
  }

  /**
   * Sets the amount for this "paid by" entry.
   *
   * @param {number} value - The amount paid. Must be a non-negative integer.
   * @throws {Error} Throws if the value is not a non-negative integer.
   */
  set amount(value) {
    if (!isNonNegativeInteger(value)) {
      throw new Error(
        `amount must be a non-negative integer. Received: ${value} (${typeof value}).`
      );
    }
    this.#amount = value;
  }

  /**
   * Gets the "isDefault" flag, indicating whether this entry is the default entry.
   * @returns {boolean} `true` if this entry is the default entry, otherwise `false`.
   */
  get isDefault() {
    return this.#isDefault;
  }

  /**
   * Sets the "isDefault" flag, marking this entry as the default entry.
   * @param {boolean} value - `true` if this entry should be the default entry, otherwise `false`.
   * @throws {TypeError} If the provided value is not a boolean.
   */
  set isDefault(value) {
    if (typeof value !== 'boolean') {
      throw new TypeError(
        `isDefault must be a boolean. Received: ${value} (${typeof value}).`
      );
    }
    this.#isDefault = value;
  }

  // Validation

  /**
   * Validates that the provided entry ID is a non-negative integer.
   *
   * @param {number} id - The entry ID to validate.
   * @throws {TypeError} Throws if the `id` is not a non-negative integer.
   * @private
   */
  #validateId(id) {
    if (!id) return;
    if (!isNonNegativeInteger(id)) {
      throw new Error(
        `id must be a non-negative integer. Received: ${id} (${typeof id}).`
      );
    }
  }
}

export default PaidByEntry;
