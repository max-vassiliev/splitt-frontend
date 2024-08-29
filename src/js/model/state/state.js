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
    this.#currentUserId = value;
  }

  get group() {
    return this.#group;
  }

  set group(value) {
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
