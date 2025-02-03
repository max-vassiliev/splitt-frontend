class ExpenseNoteView {
  #form;
  #input;
  #counter;
  #buttonClose;
  #resetBtn;

  constructor() {
    this.#parseFormElements();
  }

  #parseFormElements = () => {
    this.#form = document.querySelector('.add-expense__form_note');
    this.#input = document.querySelector(
      '.add-transaction__form_input-note#expense-note'
    );
    this.#counter = document.querySelector('.character-count.expense-note');
    this.#buttonClose = this.#form.querySelector(
      '.add-expense__form_btn-close'
    );
  };

  // GETTERS

  get form() {
    return this.#form;
  }
}

export default new ExpenseNoteView();
