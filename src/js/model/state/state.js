import Group from '../group/Group';

class State {
  #currentUserId = null;
  #group = {};
  #members = [];
  #balances = [];
  #transactions = [];

  get currentUserId() {
    return this.#currentUserId;
  }

  set currentUserId(value) {
    if (!value || typeof value !== 'number' || value <= 0) {
      throw Error('Current user ID required. Should be a positive number.');
    }
    this.#currentUserId = value;
  }

  get group() {
    return this.#group;
  }

  set group(value) {
    if (!value || !(value instanceof Group)) {
      throw Error(
        'Invalid group. The value must be a non-null instance of Group'
      );
    }
    this.#group = value;
  }

  get members() {
    return this.#members;
  }

  set members(value) {
    this.#members = value;
  }

  get balances() {
    return this.#balances;
  }

  set balances(value) {
    this.#balances = value;
  }

  get transactions() {
    return this.#transactions;
  }

  set transactions(value) {
    this.#transactions = value;
  }
}

export default new State();
