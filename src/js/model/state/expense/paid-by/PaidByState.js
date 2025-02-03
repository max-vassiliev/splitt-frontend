import PaidByEntry from './PaidByEntry.js';

class PaidByState {
  #entries;
  #usersInEntries;
  #payersInEntries;
  #defaultEntryId;
  #total;
  #remainder;
  #isValid;

  constructor() {
    this.#entries = new Map();
    this.#usersInEntries = new Set();
    this.#payersInEntries = new Set();
    this.#total = 0;
    this.#remainder = 0;
    this.#isValid = true;
  }

  /**
   * Initializes the state with a default entry for a user (should be the current user).
   * @param {bigint} userId - The current user's ID.
   */
  init = userId => {
    const defaultEntry = new PaidByEntry();
    defaultEntry.userId = userId;
    this.#entries.set(defaultEntry.entryId, defaultEntry);
    this.#usersInEntries.add(userId);
    this.#defaultEntryId = defaultEntry.entryId;
  };

  // Getters

  /**
   * Checks if the subform is valid and ready for submission.
   * @returns {boolean} `true` if valid, otherwise `false`.
   */
  isValid = () => {
    return this.#isValid;
  };

  /**
   * Retrieves all Paid By entries.
   * @returns {Map<number, PaidByEntry>} A map of entry IDs to their respective `PaidByEntry` objects.
   */
  get entries() {
    return this.#entries;
  }

  /**
   * Retrieves the ID of the default entry.
   * @returns {number} The default entry ID.
   */
  get defaultEntryId() {
    return this.#defaultEntryId;
  }

  /**
   * Retrieves the set of user IDs present in entries.
   * @returns {Set<bigint>} A set containing user IDs.
   */
  get usersInEntries() {
    return this.#usersInEntries;
  }

  /**
   * Retrieves the set of payer IDs in the entries.
   * A user is considered a payer if they have an associated amount greater than zero.
   * * @returns {Set<bigint>} A set containing payer IDs.
   */
  get payersInEntries() {
    return this.#payersInEntries;
  }

  /**
   * Gets the total amount in the Paid By form, the sum of all amounts in the entries.
   * @returns {number} The total amount.
   */
  get total() {
    return this.#total;
  }

  /**
   * Retrieves the remainder amount:
   * the difference between the total amount in the Paid By subform
   * and the expense amount in the main form.
   *
   * @returns {number} The remaining amount after calculations.
   */
  get remainder() {
    return this.#remainder;
  }

  /**
   * Retrieves a specific entry by its ID.
   *
   * @param {number} entryId - The ID of the entry to retrieve.
   * @returns {PaidByEntry} The corresponding entry.
   * @throws {Error} If the entry ID is not found.
   */
  #getEntry = entryId => {
    const entry = this.#entries.get(entryId);
    if (!entry) {
      throw new Error(`No entry found for ID ${entryId}.`);
    }
    return entry;
  };

  // Public Methods

  /**
   * Adds a new Paid By entry.
   *
   * @returns {Object} The response object.
   * @property {number} entryId The ID of the new entry.
   * @property {PaidByEntry} entry The new entry state.
   * @property {number} entriesCount The number of Paid By entries in the form state.
   */
  addEntry = () => {
    const entry = new PaidByEntry();
    const entryId = entry.entryId;
    this.#entries.set(entryId, entry);
    return { entryId, entry, entriesCount: this.#entries.size };
  };

  /**
   * Deletes an entry and updates relevant states.
   *
   * @param {number} entryId - The ID of the entry to delete.
   * @param {number} expenseAmount - The total expense amount for recalculations.
   *
   * @returns {Object} The updated state after deletion.
   * @throws {Error} If the entry cannot be deleted.
   */
  deleteEntry = (entryId, expenseAmount) => {
    this.#validateEntriesBeforeDelete();
    const entry = this.#getEntry(entryId);
    const userId = entry.userId;
    const amount = entry.amount;

    this.#entries.delete(entryId);
    if (userId) this.#deleteUser(userId);
    if (amount) this.#calculate(expenseAmount);
    this.#validate();

    return {
      entryId,
      removedUser: userId,
      payersCount: this.#payersInEntries.size,
      entriesCount: this.#entries.size,
      total: this.#total,
      remainder: this.#remainder,
      isValid: this.#isValid,
    };
  };

  /**
   * Updates the user associated with an entry.
   *
   * @param {bigint} userId - The new user ID.
   * @param {number} entryId - The ID of the entry to update.
   *
   * @returns {Object} The response object.
   * @property {number} entryId The ID of the updated entry.
   * @property {bigint} addedUser The ID of the added user.
   * @property {bigint|null} removedUser ID of the previous user associated with the entry.
   * @property {boolean} isValid The flag indicating if the subform is ready for submission.
   *
   * @throws {Error} If the user is already present.
   */
  updateUser = (userId, entryId) => {
    this.#validateUserNotPresent(userId);
    const entry = this.#getEntry(entryId);
    const currentPayerId = entry.userId;
    if (currentPayerId) this.#deleteUser(currentPayerId);
    entry.userId = userId;
    this.#addUser(userId, entry.amount);
    this.#validate();

    return {
      entryId,
      addedUser: userId,
      removedUser: currentPayerId,
      isValid: this.#isValid,
    };
  };

  /**
   * Updates the amount for an entry.
   *
   * @param {number} amount - The new amount.
   * @param {number} entryId - The ID of the entry to update.
   * @param {number} expenseAmount - The total expense amount for recalculations.
   *
   * @returns {Object} The response object.
   * @property {number} amount The entry amount
   * @property {number} total The sum of amounts in all entries.
   * @property {number} remainder The difference between the total amount in all entries and the expense amount.
   * @property {boolean} isValid The flag indicating if the form is valid for submission.
   */
  updateAmount = (amount, entryId, expenseAmount) => {
    const entry = this.#getEntry(entryId);
    const oldAmount = entry.amount;
    const userId = entry.userId;
    entry.amount = amount;

    this.#updateUserOnAmountUpdate(userId, amount, oldAmount);
    this.#calculate(expenseAmount);
    this.#validate();

    return {
      amount,
      total: this.#total,
      remainder: this.#remainder,
      isValid: this.#isValid,
    };
  };

  // Inner Logic

  /**
   * Recalculates the total and remainder amounts.
   * @param {number} expenseAmount - The expense amount.
   */
  #calculate = expenseAmount => {
    let total = 0;
    for (const entry of this.#entries.values()) {
      total += entry.amount;
    }

    this.#total = total;
    this.#remainder = expenseAmount - this.#total;
  };

  /**
   * Adds a user to the users set and marks them as a payer if applicable.
   * @param {bigint} userId - The user ID.
   * @param {number} amount - The amount associated with the user.
   */
  #addUser = (userId, amount) => {
    this.#usersInEntries.add(userId);
    if (amount > 0) this.#payersInEntries.add(userId);
  };

  /**
   * Removes a user from the users' and payers' set.
   * @param {bigint} userId - The user ID.
   */
  #deleteUser = userId => {
    this.#usersInEntries.delete(userId);
    this.#payersInEntries.delete(userId);
  };

  /**
   * Updates user's status based on amount changes.
   * Adds or removes the user's ID to or from the payers' set.
   * @param {bigint} userId The user ID.
   * @param {number} newAmount The new amount.
   * @param {number} oldAmount The old amount.
   */
  #updateUserOnAmountUpdate = (userId, newAmount, oldAmount) => {
    if (oldAmount !== 0 && newAmount !== 0) return;
    if (oldAmount === 0 && newAmount === 0) return;
    if (oldAmount === 0) {
      this.#payersInEntries.add(userId);
      return;
    }
    if (newAmount === 0) {
      this.#payersInEntries.delete(userId);
    }
  };

  // Validation

  /**
   * Validates the state of the Paid By subform. Updates the "isValid" field.
   * The subform is considered valid if the remainder is not zero and there is at least one payer.
   */
  #validate = () => {
    this.#isValid = this.#remainder !== 0 && this.#payersInEntries.size > 0;
  };

  /**
   * Ensures that a user is not already present in the entries before adding them.
   * @param {bigint} userId The user ID to check.
   * @throws {Error} If the user is already present in the entries.
   */
  #validateUserNotPresent = userId => {
    if (this.#usersInEntries.has(userId)) {
      throw new Error(`Unable to add user. User ID ${userId} already present.`);
    }
  };

  /**
   * Ensures that an entry can be deleted.
   * Prevents deletion if it is the last remaining entry.
   * @throws {Error} If attempting to delete the last remaining entry.
   */
  #validateEntriesBeforeDelete = () => {
    if (this.#entries.size === 1) {
      throw new Error(`Unable to delete entry. This is the last entry.`);
    }
  };
}

export default PaidByState;
