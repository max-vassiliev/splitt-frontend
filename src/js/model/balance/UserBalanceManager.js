import UserBalance from './UserBalance.js';
import UserBalanceDetail from './UserBalanceDetail.js';

class UserBalanceManager {
  #requiredFieldsUserBalance = ['userId', 'balance'];
  #requiredFieldsDetails = ['userId', 'amount'];

  initializeUserBalancesOnLoad(balancesData) {
    if (!Array.isArray(balancesData)) {
      throw new Error(
        `Invalid balances data. Expected an array. Received: ${balancesData} (type: ${typeof balancesData})`
      );
    }
    if (balancesData.length === 0) return new Map();

    const balances = new Map();
    balancesData.forEach(entry => {
      const userBalance = this.#initializeUserBalanceOnLoad(entry);
      const details = this.#initializeUserBalanceDetailsOnLoad(entry);
      userBalance.details = details;
      balances.set(userBalance.userId, userBalance);
    });

    return balances;
  }

  #initializeUserBalanceDetailsOnLoad(userBalance) {
    if (!Array.isArray(userBalance.details)) {
      throw new Error(
        `Invalid user balance details data. Expected an array. Received: ${
          userBalance.details
        } (type: ${typeof userBalance.details})`
      );
    }

    if (userBalance.details.details === 0) return [];

    return userBalance.details.map(entry =>
      this.#initializeUserBalanceDetailOnLoad(entry)
    );
  }

  #initializeUserBalanceOnLoad(input) {
    this.#validateUserBalanceFields(input);
    return new UserBalance(input.userId, input.balance);
  }

  #initializeUserBalanceDetailOnLoad(input) {
    this.#validateDetailsFields(input);
    return new UserBalanceDetail(input.userId, input.amount);
  }

  #validateUserBalanceFields(input) {
    this.#requiredFieldsUserBalance.forEach(field => {
      if (!(field in input)) {
        throw new Error(`Missing required field "${field}" for UserBalance.`);
      }
    });
  }

  #validateDetailsFields(input) {
    this.#requiredFieldsDetails.forEach(field => {
      if (!(field in input)) {
        throw new Error(
          `Missing required field "${field}" for UserBalanceDetail.`
        );
      }
    });
  }
}

export default new UserBalanceManager();
