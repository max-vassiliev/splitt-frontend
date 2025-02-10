class ExpenseSplittPartsView {
  #table;
  #rows;
  #totalField;
  #remainderField;
  #remainderRow;

  constructor() {
    this.#parseFormElements();
  }

  #parseFormElements = () => {
    this.#table = document.getElementById('splitt-parts-table');
    this.#rows = document.querySelectorAll('.splitt-parts__row'); // TODO! возможно, не нужно
    this.#totalField = document.querySelector(
      '.splitt-parts-column__total-amount'
    );
    this.#remainderField = document.querySelector(
      '.splitt-parts-column__remainder-amount'
    );
    this.#remainderRow = document.querySelector('.splitt-parts__row-remainder');
  };

  // LOAD

  loadUsers = users => {
    //
  };
}

export default new ExpenseSplittPartsView();
