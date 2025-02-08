import {
  EXPENSE_PAID_BY_EMPTY,
  EXPENSE_PAID_BY_COPAYMENT,
  EXPENSE_PAID_BY_CURRENT_USER,
  EXPENSE_PAID_BY_OTHER_USER,
  EXPENSE_PAID_BY_TYPES,
  USERNAME_OTHER,
} from '../../../util/Config.js';
import User from '../../user/User.js';

class PaidByService {
  /**
   * Prepares the view model for the Paid By subform.
   * @param {PaidByState} data The Paid By subform state.
   * @param {bigint} currentUserId The current user's ID.
   * @param {Map<bigint, User>} groupMembers The current group members' list.
   * @returns {Object} The Paid By view model
   */

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

    const disableAddButton = entries.size === groupMembers.size;
    const switchOptions = this.#prepareSwitchOptions(groupMembers);
    const entryViewModels = this.#prepareEntryViewModels(entries, groupMembers);
    const { type, name } = this.#prepareButtonProperties(
      payersInEntries,
      currentUserId,
      groupMembers
    );

    return {
      type,
      name,
      entries: entryViewModels,
      usersToDisable: usersInEntries,
      switchOptions,
      total,
      remainder,
      isValid,
      disableAddButton,
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
  #prepareButtonProperties = (payers, currentUserId, groupMembers) => {
    const payersCount = payers.size;
    if (payersCount === 0) return { type: EXPENSE_PAID_BY_EMPTY };
    if (payersCount > 1) return { type: EXPENSE_PAID_BY_COPAYMENT };

    const payerId = payers.next().value;

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
