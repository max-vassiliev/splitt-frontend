class ExpenseSplittSharesView {
  #table;
  #rows;
  #totalShareField;
  #totalAmountField;
  #remainderRow;
  #remainderShareField;
  #remainderAmountField;

  constructor() {
    this.#parseFormElements();
  }

  #parseFormElements = () => {
    this.#table = document.getElementById('splitt-shares-table');
    this.#rows = document.querySelectorAll('.splitt-shares__row');
    this.#totalShareField = document.querySelector(
      '.splitt-shares-column__total-share'
    );
    this.#totalAmountField = document.querySelector(
      '.splitt-shares-column__total-amount-value'
    );
    this.#remainderRow = document.querySelector(
      '.splitt-shares__row-remainder'
    );
    this.#remainderShareField = document.querySelector(
      '.splitt-shares-column__remainder-share'
    );
    this.#remainderAmountField = document.querySelector(
      '.splitt-shares-column__remainder-amount'
    );
  };

  // LOAD

  loadUsers = users => {
    //
  };
}

export default new ExpenseSplittSharesView();
