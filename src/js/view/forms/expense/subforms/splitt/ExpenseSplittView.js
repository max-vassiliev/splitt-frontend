import {
  EXPENSE_SPLITT_TYPES,
  EXPENSE_SPLITT_EQUALLY,
  EXPENSE_SPLITT_PARTS,
  EXPENSE_SPLITT_SHARES,
} from '../../../../../util/Config.js';
import equallyView from './ExpenseSplittEquallyView.js';
import partsView from './ExpenseSplittPartsView.js';
import sharesView from './ExpenseSplittSharesView.js';

class ExpenseSplittView {
  #form;
  #container;
  #btnClose;
  #splittButtonEqually;
  #splittButtonParts;
  #splittButtonShares;
  #splittButtons;
  #splittViews;

  constructor() {
    this.#parseFormElements();
    this.#initSplittButtons();
    this.#initSplittViews();
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

  #initSplittButtons = () => {
    this.#splittButtons = new Map();
    this.#splittButtons.set(EXPENSE_SPLITT_EQUALLY, this.#splittButtonEqually);
    this.#splittButtons.set(EXPENSE_SPLITT_PARTS, this.#splittButtonParts);
    this.#splittButtons.set(EXPENSE_SPLITT_SHARES, this.#splittButtonShares);
  };

  #initSplittViews = () => {
    this.#splittViews = new Map();
    this.#splittViews.set(EXPENSE_SPLITT_EQUALLY, equallyView);
    this.#splittViews.set(EXPENSE_SPLITT_PARTS, partsView);
    this.#splittViews.set(EXPENSE_SPLITT_SHARES, sharesView);
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

  // RENDER

  render = data => {
    const { type } = data;
    this.#renderButton(type);
    const activeView = this.#splittViews.get(type);
    activeView.render(data);
  };

  #renderButton = splittType => {
    this.#resetButtons();
    const checkedButton =
      this.#splittButtons.get(splittType) || this.#splittButtonEqually;
    checkedButton.checked = true;
  };

  #resetButtons = () => {
    Array.from(this.#splittButtons.values()).forEach(button => {
      button.checked = false;
    });
  };
}

export default new ExpenseSplittView();
