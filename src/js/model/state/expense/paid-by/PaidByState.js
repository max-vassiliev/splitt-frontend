import PaidByEntry from './PaidByEntry.js';

class PaidByState {
  #entries;
  #entriesPool;
  #defaultEntryId;
  #usersInEntries;
  #payersInEntries;
  #total;
  #remainder;
  #isValid;
  #isInitialized;

  constructor() {
    this.#entries = new Map();
    this.#entriesPool = new Map();
    this.#usersInEntries = new Set();
    this.#payersInEntries = new Set();
    this.#total = 0;
    this.#remainder = 0;
    this.#isValid = true;
    this.#isInitialized = false;
  }

  /**
   * Initializes the state with a default entry for a user (should be the current user).
   * @param {bigint} userId - The current user's ID.
   */
  init = currentUserId => {
    this.#loadDefaultEntry(currentUserId);
    this.#isInitialized = true;
  };

  /**
   * Resets the state by clearing all entries and reloading the default entry.
   *
   * @param {bigint} currentUserId - The ID of the current user to set as the default entry.
   */
  reset = currentUserId => {
    this.#clear();
    this.#loadDefaultEntry(currentUserId);
  };

  /**
   * Clears all Paid By state data.
   *
   * @private
   */
  #clear = () => {
    this.#entries.clear();
    this.#usersInEntries.clear();
    this.#payersInEntries.clear();
    this.#total = 0;
    this.#remainder = 0;
    this.#isValid = true;
  };

  /**
   * Initializes and loads the default entry for the Paid By subform.
   *
   * @private
   * @param {bigint} currentUserId - The ID of the user to be set as the default entry.
   */
  #loadDefaultEntry = currentUserId => {
    const defaultEntry = new PaidByEntry();
    defaultEntry.userId = currentUserId;
    defaultEntry.isDefault = true;
    this.#entries.set(defaultEntry.entryId, defaultEntry);
    this.#defaultEntryId = defaultEntry.entryId;
    this.#usersInEntries.add(currentUserId);
  };

  // Getters

  /**
   * Checks if the subform is valid and ready for submission.
   * @returns {boolean} `true` if valid, otherwise `false`.
   */
  get isValid() {
    return this.#isValid;
  }

  /**
   * Checks if the form has been initialized.
   * @returns {boolean} `true` if it has, otherwise `false`.
   */
  get isInitialized() {
    return this.#isInitialized;
  }

  /**
   * Retrieves all Paid By entries.
   * @returns {Map<number, PaidByEntry>} A map of entry IDs to their respective `PaidByEntry` objects.
   */
  get entries() {
    return this.#entries;
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
   * Checks if the form contains only a single entry.
   *
   * @returns {boolean} Returns `true` if there is exactly one entry, otherwise `false`.
   */
  hasSingleEntry = () => {
    return this.#entries.size === 1;
  };

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

  /**
   * Retrieves the default entry state.
   * @returns {PaidByEntry} The default entry state.
   */
  getDefaultEntry = () => {
    return this.#entries.get(this.#defaultEntryId);
  };

  // Public Methods

  /**
   * Adds a new Paid By entry to the active entries map.
   *
   * Utilizes an existing entry from the entries pool, if available.
   * Otherwise, creates a new entry state object.
   *
   * @returns {Object} The response object.
   * @property {number} entryId The ID of the new entry.
   * @property {PaidByEntry} entry The new entry state.
   * @property {boolean} isNewEntry The flag marking whether a new entry state object was created.
   * @property {number} entriesCount The number of Paid By entries in the form state.
   * @property {boolean} defaultEntryAffected - Indicates whether the default entry was affected.
   * @property {number} [defaultEntryId] - The ID of the default entry if it was affected.
   */
  addEntry = () => {
    let entry;
    const isNewEntry = this.#entriesPool.size === 0;
    const isDefaultEntryAffected = this.hasSingleEntry();
    if (!isNewEntry) {
      entry = this.#entriesPool.values().next().value;
      this.#entriesPool.delete(entry.entryId);
    } else {
      entry = new PaidByEntry();
    }
    const entryId = entry.entryId;
    this.#entries.set(entryId, entry);

    return {
      entryId,
      entry,
      isNewEntry,
      entriesCount: this.#entries.size,
      usersInEntries: this.#usersInEntries,
      isDefaultEntryAffected,
      ...(isDefaultEntryAffected && { defaultEntryId: this.#defaultEntryId }),
    };
  };

  /**
   * Removes an entry from the active entries map.
   *
   * The removed entry is moved to the entries pool.
   * The remaining entries are updated accordingly.
   *
   * @param {number} entryId - The ID of the entry to be removed.
   * @param {number} expenseAmount - The total amount of the expense.
   * @returns {Object} - An object containing the status of removal and related updates.
   */
  removeEntry = (entryId, expenseAmount) => {
    const entry = this.#entries.get(entryId);
    const isRemoved = this.#isEntryRemovable(entry, entryId);
    if (!isRemoved) return { isRemoved };

    const userId = entry.userId;
    const isRecalculated = entry.amount > 0;

    entry.clear();
    this.#entriesPool.set(entryId, entry);
    this.#entries.delete(entryId);
    if (userId) this.#deleteUser(userId);

    const isDefaultEntryAffected = this.hasSingleEntry();

    if (isDefaultEntryAffected) {
      this.#updateDefaultEntryAmount(expenseAmount);
    }

    if (isRecalculated) this.#calculate(expenseAmount);
    this.#validate();

    return {
      isRemoved,
      isDefaultEntryAffected,
      isRecalculated,
      removedUserId: userId || null,
      ...(isDefaultEntryAffected && { defaultEntryId: this.#defaultEntryId }),
    };
  };

  /**
   * Checks whether an entry can be removed from the active entries map.
   *
   * Prevents accidental deletion of the default entry.
   *
   * @private
   * @param {PaidByEntry} entry - The entry object to be checked.
   * @param {number} entryId - The ID of the entry being evaluated.
   * @returns {boolean} - Returns `true` if the entry can be removed, otherwise `false`.
   */
  #isEntryRemovable = (entry, entryId) => {
    if (!entry) {
      console.warn(`No active entry found for ID ${entryId}.`);
      return false;
    }
    if (entry.isDefault || this.#entries.size === 1) {
      console.warn(`Unable to remove entry. This is the default entry.`);
      return false;
    }
    return true;
  };

  /**
   * Updates the user associated with an entry.
   *
   * @param {bigint} userId - The new user ID.
   * @param {number} entryId - The ID of the entry to update.
   *
   * @returns {Object} The response object.
   * @property {bigint} addedUser The ID of the added user.
   * @property {bigint|null} removedUserId The ID of the removed user or `null` if the previous user was not set.
   *
   * @throws {Error} If the user is already present.
   */
  updateUser = (entryId, userId) => {
    this.#validateUserNotPresent(userId);
    const entry = this.#getEntry(entryId);
    const currentPayerId = entry.userId;
    if (currentPayerId) this.#deleteUser(currentPayerId);
    entry.userId = userId;
    this.#addUser(userId, entry.amount);
    this.#validate();

    return {
      addedUserId: userId,
      removedUserId: currentPayerId,
    };
  };

  /**
   * Updates the amount for an entry.
   *
   * @param {number} entryId - The ID of the entry to update.
   * @param {number} amount - The new amount.
   * @param {number} expenseAmount - The total expense amount for recalculations.
   * @returns {Object} The response object.
   */
  updateAmount = (entryId, amount, expenseAmount) => {
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
    };
  };

  /**
   * Makes updates to the Paid By form after an expense amount update.
   *
   * - If there is only one payer, their amount is automatically updated.
   * - Recalculates totals and revalidates the form after the update.
   * - Returns relevant data about the update.
   *
   * @param {number} expenseAmount - The new expense amount.
   * @returns {Object} The updated state after the amount change.
   * @property {boolean} hasSingleEntry - Indicates if there is only one entry.
   * @property {number} total - The updated total amount.
   * @property {number} remainder - The remaining amount to be allocated.
   * @property {boolean} isValid - Whether the updated form state is valid.
   * @property {number} defaultEntryAmount - The updated amount for the default (single) entry.
   */
  updateAfterExpenseAmountChange = expenseAmount => {
    const hasSingleEntry = this.hasSingleEntry();
    if (hasSingleEntry) {
      this.#updateDefaultEntryAmount(expenseAmount);
    }
    const defaultEntryAmount = this.getDefaultEntry().amount;

    this.#calculate(expenseAmount);
    this.#validate();

    return {
      hasSingleEntry,
      total: this.#total,
      remainder: this.#remainder,
      isValid: this.#isValid,
      defaultEntryAmount,
    };
  };

  /**
   * Updates the amount for the single entry if only one payer exists.
   *
   * @param {number} amount - The new amount to set for the default entry.
   * @returns {boolean} `true` if the entry was updated, otherwise `false`.
   */
  #updateDefaultEntryAmount = amount => {
    const defaultEntry = this.#entries.get(this.#defaultEntryId);
    if (defaultEntry.amount === amount) return false;

    defaultEntry.amount = amount;

    if (amount > 0 && this.#payersInEntries.size === 0) {
      this.#payersInEntries.add(defaultEntry.userId);
    } else if (amount === 0 && this.#payersInEntries.size > 0) {
      this.#payersInEntries.clear();
    }

    return true;
  };

  // Inner Logic

  /**
   * Recalculates the total and remainder amounts.
   * @param {number} expenseAmount - The expense amount.
   */
  #calculate = expenseAmount => {
    if (this.hasSingleEntry()) {
      this.#total = expenseAmount;
      this.#remainder = 0;
      return;
    }

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
    if (!userId) return;
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
   */
  #validate = () => {
    if (this.#remainder !== 0 || this.#payersInEntries.size === 0) {
      this.#isValid = false;
      return;
    }

    this.#isValid = ![...this.#entries.values()].some(
      entry => entry.amount > 0 && !entry.userId
    );
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
}

export default PaidByState;
