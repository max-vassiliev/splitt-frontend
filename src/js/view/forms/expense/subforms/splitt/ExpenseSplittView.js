import {
  EXPENSE_SPLITT_EQUALLY,
  EXPENSE_SPLITT_PARTS,
  EXPENSE_SPLITT_SHARES,
  ACTIVE_CLASS,
} from '../../../../../util/Config.js';
import {
  activateHTMLElement,
  removeUtilityClass,
} from '../../../../util/RenderHelper.js';
import equallyView from './ExpenseSplittEquallyView.js';
import partsView from './ExpenseSplittPartsView.js';
import sharesView from './ExpenseSplittSharesView.js';

class ExpenseSplittView {
  #form;
  #selectors;
  #tableContainer;
  #btnClose;
  #splittButtonEqually;
  #splittButtonParts;
  #splittButtonShares;
  #splittButtons;
  #splittContainers;
  #splittViews;

  constructor() {
    this.#parseFormElements();
    this.#initSplittButtons();
    this.#initSplittContainers();
    this.#initSplittViews();
    this.#initSelectors();
  }

  #parseFormElements = () => {
    this.#form = document.querySelector('.add-expense__form_splitt');
    this.#tableContainer = document.getElementById('splitt-table-container');
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

  #initSplittContainers = () => {
    this.#splittContainers = [
      equallyView.container,
      partsView.container,
      sharesView.container,
    ];
  };

  #initSelectors = () => {
    this.#selectors = {
      global: {
        TABLE: '.splitt-form__table',
        TYPES: new Map([
          ['equally', EXPENSE_SPLITT_EQUALLY],
          ['parts', EXPENSE_SPLITT_PARTS],
          ['shares', EXPENSE_SPLITT_SHARES],
        ]),
      },
      equally: equallyView.getSelectors(),
      parts: partsView.getSelectors(),
      shares: sharesView.getSelectors(),
    };
  };

  // LOAD

  loadUsers = data => {
    equallyView.loadUsers(data);
    partsView.init(data.users);
    sharesView.init(data.users);
  };

  // GETTERS

  get form() {
    return this.#form;
  }

  getSelectors = () => {
    return this.#selectors;
  };

  // ADD HANDLERS

  addHandlerOptionButtonClick = handler => {
    this.#addHandlerOptionButtonClickEqually(handler);
    this.#addHandlerOptionButtonClickParts(handler);
    this.#addHandlerOptionButtonClickShares(handler);
  };

  #addHandlerOptionButtonClickEqually = handler => {
    this.#splittButtonEqually.addEventListener('click', () =>
      handler(EXPENSE_SPLITT_EQUALLY)
    );
  };

  #addHandlerOptionButtonClickParts = handler => {
    this.#splittButtonParts.addEventListener('click', () =>
      handler(EXPENSE_SPLITT_PARTS)
    );
  };

  #addHandlerOptionButtonClickShares = handler => {
    this.#splittButtonShares.addEventListener('click', () =>
      handler(EXPENSE_SPLITT_SHARES)
    );
  };

  addHandlerTableClick = handler => {
    this.#tableContainer.addEventListener('click', handler);
  };

  addHandlerTableInput = handler => {
    this.#tableContainer.addEventListener('input', handler);
  };

  addHandlerCloseButtonClick = handler => {
    this.#btnClose.addEventListener('click', handler);
  };

  // METHODS

  selectType = type => {
    this.#renderButton(type);
  };

  // RENDER

  render = data => {
    const { type } = data;
    this.#renderButton(type);
    const activeView = this.#splittViews.get(type);
    activeView.render(data);
    this.#showSplittView(activeView.container);
  };

  // Render After Update

  renderAfterRowClick = (type, userId) => {
    switch (type) {
      case EXPENSE_SPLITT_EQUALLY:
        break;
      case EXPENSE_SPLITT_PARTS:
        partsView.focusInput(userId);
        break;
      case EXPENSE_SPLITT_SHARES:
        sharesView.focusInput(userId);
        break;
      default:
        console.warn('Unknown Splitt Type');
    }
  };

  renderCursorPosition = data => {
    const { splittType, inputValue, userId, cursorPosition } = data;
    const splittView = this.#splittViews.get(splittType);
    splittView.renderCursorPosition(userId, inputValue, cursorPosition);
  };

  // Render Elements

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

  #showSplittView = viewContainer => {
    this.#hideSplittViews();
    activateHTMLElement(viewContainer);
  };

  #hideSplittViews = () => {
    this.#splittContainers.forEach(splittContainer => {
      removeUtilityClass(splittContainer, ACTIVE_CLASS);
    });
  };
}

export default new ExpenseSplittView();
