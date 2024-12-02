class AddRepaymentButtonView {
  #button;

  constructor() {
    this.#button = document.querySelector('.add-repayment__btn');
  }

  addHandlerClick(handler) {
    this.#button.addEventListener('click', handler);
  }
}

export default new AddRepaymentButtonView();
