import groupManager from '../group/GroupManager.js';
import state from './State.js';

class StateManager {
  getState() {
    return state;
  }

  getGroup() {
    return state.group;
  }

  loadState(data) {
    if (!data || typeof data !== 'object')
      throw new Error('Invalid data object');

    state.currentUserId = data.currentUserId;
    state.group = groupManager.createGroupOnLoad(data.group);
    state.members = data.members;
    state.balances = data.balances;
    state.transactions = data.transactions;
  }
}

export default new StateManager();
