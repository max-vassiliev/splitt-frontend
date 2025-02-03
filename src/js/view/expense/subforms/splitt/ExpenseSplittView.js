import equallyView from './ExpenseSplittEquallyView.js';
import partsView from './ExpenseSplittPartsView.js';
import sharesView from './ExpenseSplittSharesView.js';

class ExpenseSplittView {
  #form;
  #container;
  #btnClose;
  // #splittTypeButtons;
  #splittButtonEqually;
  #splittButtonParts;
  #splittButtonShares;

  constructor() {
    this.#parseFormElements();
  }

  #parseFormElements = () => {
    this.#form = document.querySelector('.add-expense__form_splitt');
    this.#container = document.querySelector('.splitt-form-container');
    this.#btnClose = this.#form.querySelector('.add-expense__form_btn-close');
    this.#splittButtonEqually = document.getElementById(
      'splitt-equally-button'
    );
    this.#splittButtonParts = document.getElementById('splitt-parts-button');
    this.#splittButtonShares = document.getElementById('splitt-shares-button');
  };

  // LOAD

  loadUsers = data => {
    equallyView.loadUsers(data);
    // TODO!
    // partsView.loadUsers(data);
    // sharesView.loadUsers(data);
  };

  // GETTERS

  get form() {
    return this.#form;
  }

  // ADD HANDLERS

  addHandlerSplittButtonClickEqually = handler => {
    this.#splittButtonEqually.addEventListener('click', handler);
  };

  addHandlerSplittButtonClickParts = handler => {
    this.#splittButtonParts.addEventListener('click', handler);
  };

  addHandlerSplittButtonClickShares = handler => {
    this.#splittButtonShares.addEventListener('click', handler);
  };

  addHandlerCloseButtonClick = handler => {
    this.#btnClose.addEventListener('click', handler);
  };
}

export default new ExpenseSplittView();
