import {
  EXPENSE_PAID_BY_EMPTY,
  EXPENSE_PAID_BY_COPAYMENT,
  EXPENSE_PAID_BY_CURRENT_USER,
  EXPENSE_PAID_BY_OTHER_USER,
  EXPENSE_PAID_BY_TYPES,
  USERNAME_OTHER,
} from '../../../../util/Config.js';
import User from '../../../user/User.js';

class PaidByService {
  /**
   * Prepares the view model for the Paid By subform.
   * @param {PaidByState} paidByData - The Paid By subform state.
   * @param {bigint} currentUserId - The current user's ID.
   * @param {Map<bigint, User>} groupMembers - A map of the group's members.
   * @returns {Object} The Paid By view model.
   * @property {string} type - The type of payer (single user, multiple users, or empty).
   * @property {string} [name] - The name of the user who paid, if applicable.
   * @property {Object} entries - The list of payer entries.
   * @property {Object|null} entries.defaultEntry - The default Paid By entry, if one exists.
   * @property {Array<Object>} otherEntries — An array of additional Paid By entries.
   * @property {Set<bigint>} usersToDisable - Users who should be disabled in the UI.
   * @property {Map<bigint, string>} switchOptions - Options for the payer selection switch.
   * @property {number} total - The total amount paid.
   * @property {number} remainder - The remaining amount to be covered.
   * @property {boolean} isValid - Whether the Paid By data is valid.
   * @property {boolean} disableAddButton - Whether the "Add Payer" button should be disabled.
   */
  prepareViewModel = (paidByData, currentUserId, groupMembers) => {
    const {
      entries,
      usersInEntries,
      payersInEntries,
      total,
      remainder,
      isValid,
    } = paidByData;

    const hasSingleEntry = paidByData.hasSingleEntry();
    const disableAddButton = entries.size === groupMembers.size;
    const switchOptions = this.#prepareSwitchOptions(groupMembers);
    const entryViewModels = this.#prepareEntryViewModels(entries, groupMembers);
    entryViewModels.defaultEntry.isSingleEntry = hasSingleEntry;
    const { type, name } = this.#prepareTypeProperties(
      payersInEntries,
      currentUserId,
      groupMembers
    );

    return {
      type,
      name,
      entries: entryViewModels,
      usersToDisable: usersInEntries,
      hasSingleEntry,
      switchOptions,
      total,
      remainder,
      isValid,
      disableAddButton,
    };
  };

  /**
   * Prepares the initial view model for the Paid By subform when loading the Add Expense form.
   *
   * @param {Object} data - The data required to prepare the view model.
   * @param {Object} data.paidByStateAdd - The Paid By subform state for Add Expense mode.
   * @param {Map<bigint, User>} data.groupMembers - A map of the group's members.
   * @returns {Object} The prepared view model for the Paid By subform.
   */
  prepareViewModelOnLoad = data => {
    const { paidByStateAdd, groupMembers } = data;
    const usersToDisable = paidByStateAdd.usersInEntries;
    const switchOptions = this.#prepareSwitchOptions(groupMembers);

    const defaultEntryStateAdd = paidByStateAdd.getDefaultEntry();
    const defaultEntryAddUser = groupMembers.get(defaultEntryStateAdd.userId);
    const defaultEntryAdd = {
      entryId: defaultEntryStateAdd.entryId,
      userId: defaultEntryStateAdd.userId,
      name: defaultEntryAddUser.name,
      avatar: defaultEntryAddUser.avatar,
      amount: defaultEntryStateAdd.amount,
    };

    return {
      defaultEntryAdd,
      usersToDisable,
      switchOptions,
    };
  };

  /**
   * Prepares the view model for the "Paid By" section after an expense amount update.
   *
   * @param {Object} data - The data required to construct the "Paid By" view model.
   * @param {Object} data.updateResponsePaidBy - The response from the "Paid By" state update.
   * @param {Object} data.paidByState - The current state of the "Paid By" section.
   * @param {string} data.currentUserId - The ID of the current user.
   * @param {Object} data.groupMembers - The members of the expense group.
   * @returns {Object} The structured "Paid By" view model.
   * @property {string} type - The "Paid By" type, one of {@link EXPENSE_PAID_BY_TYPES}.
   * @property {string|null} name - The name associated with payer (for single payers), or `null` if not applicable.
   */
  prepareViewModelAfterExpenseAmountUpdate = data => {
    const { updateResponsePaidBy, paidByState, currentUserId, groupMembers } =
      data;
    const { type, name } = this.#prepareTypeProperties(
      paidByState.payersInEntries,
      currentUserId,
      groupMembers
    );

    return {
      type,
      name,
      ...updateResponsePaidBy,
    };
  };

  /**
   * Prepares the view model after updating the payer.
   *
   * @param {Object} data - Data needed to construct the updated view model.
   * @param {Object} data.paidByState - The updated PaidBy state after the payer change.
   * @param {Map<bigint, User>} data.groupMembers - A map of the group's members.
   * @param {bigint} data.currentUserId - The ID of the current user.
   * @param {bigint} data.addedUserId - The ID of the newly assigned payer.
   * @param {bigint|null} data.removedUserId - The ID of the removed payer or `null`.
   * @param {string\null} data.avatar - URL of the newly assigned payer's avatar or `null`.
   * @param {Object} data.balance - The updated balance after payer change.
   * @param {number} data.entryId - The ID of the expense entry that was updated.
   * @returns {Object} The view model containing updated payer data and state.
   */
  prepareViewModelAfterUpdatePayer = data => {
    const {
      paidByState,
      groupMembers,
      currentUserId,
      addedUserId,
      removedUserId,
      avatar,
      balance,
      entryId,
    } = data;
    const { type, name } = this.#prepareTypeProperties(
      paidByState.payersInEntries,
      currentUserId,
      groupMembers
    );

    return {
      type,
      name,
      avatar,
      entryId,
      balance,
      addedUserId,
      removedUserId,
    };
  };

  /**
   * Prepares the updated view model after a payer amount is changed.
   *
   * @param {Object} data - The data needed to generate the updated view model.
   * @param {Object} data.response - The response from updating the payer amount.
   * @param {Object} data.form - The updated expense form.
   * @param {Object} data.balance - The updated balance after the change.
   * @param {bigint} data.currentUserId - The ID of the current user.
   * @param {Map<bigint, User>} data.groupMembers - A map of the group's members.
   * @param {number} data.entryId - The ID of the updated payer entry.
   * @returns {Object} The updated view model containing UI-related data.
   */
  prepareViewModelAfterUpdatePayerAmount = data => {
    const { response, form, balance, currentUserId, groupMembers, entryId } =
      data;

    const paidByButtonProperties = this.#prepareTypeProperties(
      form.paidBy.payersInEntries,
      currentUserId,
      groupMembers
    );
    return {
      response,
      entryId,
      paidByButtonProperties,
      balance,
      expenseAmount: form.amount,
      isFormValid: form.isValid,
    };
  };

  /**
   * Prepares the view model after a new Paid By entry is added.
   * This ensures the UI reflects the latest form state.
   *
   * @param {Object} data - The data related to the new entry.
   * @param {number} data.entriesCount - The total number of Paid By entries in the form state.
   * @param {Array} data.groupMembers - The list of all group members.
   * @param {Set<number>} data.usersInEntries - Set of user IDs currently assigned to certain entries.
   * @param {PaidByEntry} data.entry - The newly added Paid By entry state.
   * @param {Object} rest - Additional properties from the response object.
   *
   * @returns {Object} The view model for rendering.
   */
  prepareViewModelAfterAddPayerEntry = data => {
    const {
      entriesCount,
      groupMembers,
      usersInEntries,
      entry: entryState,
      ...rest
    } = data;

    const deactivateAddPayerButton = entriesCount === groupMembers.size;
    const switchOptions = this.#prepareSwitchOptions(groupMembers);
    const entry = {
      entryId: entryState.entryId,
      userId: entryState.userId,
      amount: entryState.amount,
      isNewEntry: entryState.isNewEntry,
      isDefault: entryState.isDefault,
    };

    return {
      shouldRender: true,
      entry,
      deactivateAddPayerButton,
      switchOptions,
      usersToDisable: usersInEntries,
      ...rest,
    };
  };

  /**
   * Prepares the view model after a payer entry is removed.
   *
   * @param {Object} data - The data required to update the view.
   * @param {number} data.entryId - The ID of the removed entry.
   * @param {Object} data.response - The response object from the removal operation.
   * @param {Object} data.form - The updated expense form.
   * @param {number} data.currentUserId - The ID of the current user.
   * @param {Array} data.groupMembers - The list of group members.
   * @param {Object} data.balance - The updated balance details.
   * @returns {Object} - The updated view model with necessary UI updates.
   */
  prepareViewModelAfterRemovePayerEntry = data => {
    const { entryId, response, form, currentUserId, groupMembers, balance } =
      data;
    const { isDefaultEntryAffected, removedUserId, isRecalculated, ...rest } =
      response;

    const paidByButtonProperties = this.#prepareTypeProperties(
      form.paidBy.payersInEntries,
      currentUserId,
      groupMembers
    );

    const calculationRowData = !isRecalculated
      ? null
      : {
          total: form.paidBy.total,
          remainder: form.paidBy.remainder,
          expenseAmount: form.amount,
        };

    const defaultEntryData = !isDefaultEntryAffected
      ? null
      : {
          defaultEntryId: response.defaultEntryId,
          expenseAmount: form.amount,
        };

    return {
      shouldRender: true,
      entryId,
      removedUserId,
      isDefaultEntryAffected,
      defaultEntryData,
      isRecalculated,
      calculationRowData,
      paidByButtonProperties,
      balance,
      isExpenseFormValid: form.isValid,
    };
  };

  /**
   * Determines the properties for the Paid By button in the main form.
   *
   * @param {Set<bigint>} payers - A set of payer IDs.
   * @param {bigint} currentUserId - The current user's ID.
   * @param {Map<bigint, User>} groupMembers - A map of the group's members.
   * @returns {Object} The object containing properties for the Paid By button.
   * @property {string} type - Specifies whether the expense was covered by the current user,
   *                           another user, multiple users, or if it is empty.
   *                           The value is one of {@link EXPENSE_PAID_BY_TYPES}.
   * @property {string} [name] - The payer's name, included if a single user other than
   *                            the current user paid.
   */
  #prepareTypeProperties = (payers, currentUserId, groupMembers) => {
    const payersCount = payers.size;
    if (payersCount === 0) return { type: EXPENSE_PAID_BY_EMPTY };
    if (payersCount > 1) return { type: EXPENSE_PAID_BY_COPAYMENT };

    const payerId = payers.values().next().value;

    if (payerId === currentUserId) {
      return { type: EXPENSE_PAID_BY_CURRENT_USER };
    } else {
      let name = groupMembers.get(payerId)?.name;
      if (!name) name = USERNAME_OTHER;
      return { type: EXPENSE_PAID_BY_OTHER_USER, name };
    }
  };

  /**
   * Prepares options for the payer selection switch.
   *
   * @param {Map<bigint, User>} groupMembers - A map of the group's members.
   * @returns {Map<bigint, string>} A map where each user ID is mapped to the corresponding user name.
   */
  #prepareSwitchOptions = groupMembers => {
    return new Map(Array.from(groupMembers, ([id, user]) => [id, user.name]));
  };

  /**
   * Prepares the view models for each Paid By entry.
   *
   * @param {Map<number, PaidByEntry>} entries - A map of Paid By entries.
   * @param {Map<bigint, User>} groupMembers - A map of the group's members.
   * @returns {Object} The processed entry view models.
   * @property {Object|null} defaultEntry - The default Paid By entry, if one exists.
   * @property {Array<Object>} otherEntries - An array of additional Paid By entries.
   */
  #prepareEntryViewModels = (entries, groupMembers) => {
    let defaultEntry = null;
    const otherEntries = [];
    entries.forEach((entry, entryId) => {
      const userId = entry.userId;
      const user = groupMembers.get(userId);
      const entryView = {
        entryId: entryId,
        userId: userId,
        name: user.name,
        avatar: user.avatar,
        amount: entry.amount,
        isDefault: entry.isDefault,
      };
      if (entry.isDefault && defaultEntry === null) {
        defaultEntry = entryView;
      } else {
        otherEntries.push(entryView);
      }
    });
    return { defaultEntry, otherEntries };
  };
}

export default new PaidByService();
