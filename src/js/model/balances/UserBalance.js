class UserBalance {
  #userId;
  #balance;
  #details;

  constructor(userId, balance, details = []) {
    this.#userId = userId;
    this.#balance = balance;
    this.#details = details;
  }

  get userId() {
    return this.#userId;
  }

  set userId(value) {
    this.#userId = value;
  }

  get balance() {
    return this.#balance;
  }

  set balance(value) {
    this.#balance = value;
  }

  get details() {
    return this.#details;
  }

  set details(value) {
    this.#details = value;
  }
}

export default UserBalance;
