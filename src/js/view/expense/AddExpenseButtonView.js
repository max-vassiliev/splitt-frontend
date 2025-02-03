class AddExpenseButtonView {
  #button;

  constructor() {
    this.#button = document.querySelector('.add-expense__btn');
  }

  addHandlerClick(handler) {
    this.#button.addEventListener('click', handler);
  }
}

export default new AddExpenseButtonView();
