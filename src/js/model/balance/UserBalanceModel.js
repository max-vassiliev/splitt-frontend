import stateManager from '../state/StateManager.js';

class UserBalanceModel {
  /**
   * Gets the data required to load the Group Stats table.
   * @returns {Object} An object containing user balances in the group, the locale and currency symbol.
   */
  getGroupStatsData() {
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
