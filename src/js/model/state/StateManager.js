import state from './State.js';
import groupManager from '../group/GroupManager.js';
import balanceManager from '../balance/UserBalanceManager.js';
import userManager from '../user/UserManager.js';
import TransactionManager from '../transaction/TransactionManager.js';

class StateManager {
  #requiredFieldsOnPageLoad = [
    'balances',
    'transactions',
    'currentUserId',
    'group',
  ];

  getState() {
    return state;
  }

  getGroup() {
    return state.group;
  }

  loadState(data) {
    this.#validateDataOnPageLoad(data);

    state.currentUserId = data.currentUserId;
    state.group = groupManager.initializeGroupOnLoad(data.group);
    state.members = userManager.initializeMembersOnLoad(data.members);
    state.balances = balanceManager.initializeUserBalancesOnLoad(data.balances);
    state.transactions = TransactionManager.initializeTransactionsOnLoad(
      data.transactions
    );
  }

  #validateDataOnPageLoad(data) {
    if (!data || typeof data !== 'object')
      throw new Error(`Invalid data object. Received: ${data} (type: ${data})`);
    this.#requiredFieldsOnPageLoad.forEach(field => {
      if (!(field in data)) {
        throw new Error(`Missing required field "${field}" for page load.`);
      }
    });
  }
}

export default new StateManager();
