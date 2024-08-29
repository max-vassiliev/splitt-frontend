import UserBalance from './UserBalance.js';
import UserBalanceDetail from './UserBalanceDetail.js';

class UserBalanceManager {
  initializeUserBalances(balancesData) {
    if (!balancesData || !Array.isArray(balancesData)) {
      throw Error('Unable to load the page with invalid balances data.');
    }

    if (balancesData.length === 0) return balancesData;

    const balances = [];

    balancesData.forEach(entry => {
      const balance = new UserBalance(entry.userId, entry.balance);
      const details = this.#initializeUserBalanceDetails(balance.details);
      balance.details = details;
      balances.push(balance);
    });

    return balances;
  }

  #initializeUserBalanceDetails(balanceDetails) {
    if (!balanceDetails || !Array.isArray(balanceDetails)) {
      return [];
    }

    return balanceDetails.map(
      entry => new UserBalanceDetail(entry.userId, entry.amount)
    );
  }
}

export default new UserBalanceManager();
