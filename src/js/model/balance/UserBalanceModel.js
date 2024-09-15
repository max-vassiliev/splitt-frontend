import stateManager from '../state/StateManager.js';
import UserBalanceDetail from './UserBalanceDetail.js';

class UserBalanceModel {
  /**
   * Gets the data required to load the User Summary element.
   * @returns {Object} An object containing the following fields:
   *                     - status: the user's status ('positive', 'negative' or 'neutral')
   *                     - details: array of objects with userId, username, avatar and amount;
   *                     - currencySymbol
   *                     - locale
   */
  getUserSummaryData() {
    const userBalance = stateManager.getCurrentUserBalance();
    const status = stateManager.getUserStatus();
    const details = this.#getUserSummaryDetails(userBalance.details);
    const { locale, currencySymbol } =
      stateManager.getLocaleAndCurrencySymbol();

    return { status, details, locale, currencySymbol };
  }

  /**
   * Enhances each UserBalanceDetail in the provided array with additional user information.
   * @param {Array<UserBalanceDetail>} details - An array of UserBalanceDetail instances or an empty array.
   * @returns {Array<Object>} - An array of objects where each object contains userId, username avatar, and amount.
   *                            The username and avatar are added based on the corresponding user's information.
   */
  #getUserSummaryDetails(details) {
    if (details.length === 0) return [];
    const userIds = details.map(detail => detail.userId);
    const users = stateManager.getMembersByIds(userIds);

    const userSummaryDetails = details.map(detail => {
      const userId = detail.userId;
      const { name: username, avatar } = users.get(userId);
      return {
        userId,
        username,
        avatar,
        amount: detail.amount,
      };
    });

    return userSummaryDetails;
  }

  /**
   * Gets the data required to load the Group Summary table.
   * @returns {Object} An object containing user balances in the group, the locale and currency symbol.
   */
  getGroupSummaryData() {
    const balances = this.#getGroupBalances();
    const { locale, currencySymbol } =
      stateManager.getLocaleAndCurrencySymbol();
    return { balances, locale, currencySymbol };
  }

  /**
   * Gets an array of user balances in the group without details.
   * @returns {Array} An array of objects with the fields: userId, username, avatar, balance.
   */
  #getGroupBalances() {
    const balances = stateManager.getGroupBalances();
    const members = stateManager.getMembers();

    return Array.from(members.values()).map(member => {
      const { id, name, avatar } = member;
      const balance = balances.get(id)?.balance || null;
      return {
        userId: id,
        username: name,
        avatar,
        balance,
      };
    });
  }
}

export default new UserBalanceModel();
