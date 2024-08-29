class UserBalanceDetail {
  #userId;
  #amount;

  constructor(userId, amount) {
    this.#userId = userId;
    this.#amount = amount;
  }

  get userId() {
    return this.#userId;
  }

  set userId(value) {
    this.#userId = value;
  }

  get amount() {
    return this.#amount;
  }

  set amount(value) {
    this.#amount = value;
  }
}

export default UserBalanceDetails;
