import {
  EXPENSE_SPLITT_EQUALLY,
  EXPENSE_SPLITT_PARTS,
  EXPENSE_SPLITT_SHARES,
} from '../../../util/Config.js';
import TypeParser from '../../../util/TypeParser.js';

class ExpenseSplittHandler {
  #controller;
  #selectors;

  constructor(config) {
    this.#validateConfiguration(config);

    const { controller, selectors } = config;
    this.#controller = controller;
    this.#selectors = selectors;
  }

  // Event Handlers: Input

  handleTableInput = event => {
    const type = this.#parseSplittType(event);

    switch (type) {
      case EXPENSE_SPLITT_EQUALLY:
        this.#handleEquallyInput(event);
        break;
      case EXPENSE_SPLITT_PARTS:
        this.#handlePartsInput(event);
        break;
      case EXPENSE_SPLITT_SHARES:
        this.#handleSharesInput(event);
        break;
      default:
        console.warn('Unknown Splitt Type');
    }
  };

  #handleEquallyInput = event => {
    return;
  };

  #handlePartsInput = event => {
    if (!event.target.matches(this.#selectors.parts.INPUT)) return;
    const userId = this.#parseUserId(event, this.#selectors.parts.ROW);
    const inputValue = event.target.value;
    const cursorPosition = event.target.selectionStart;
    this.#controller.handleSplittUpdate({
      userId,
      inputValue,
      cursorPosition,
      splittType: EXPENSE_SPLITT_PARTS,
    });
  };

  #handleSharesInput = event => {
    if (!event.target.matches(this.#selectors.shares.INPUT)) return;
    const userId = this.#parseUserId(event, this.#selectors.shares.ROW);
    const inputValue = event.target.value;
    const cursorPosition = event.target.selectionStart;
    this.#controller.handleSplittUpdate({
      userId,
      inputValue,
      cursorPosition,
      splittType: EXPENSE_SPLITT_SHARES,
    });
  };

  // Event Handlers: Click

  handleTableClick = event => {
    const type = this.#parseSplittType(event);
    if (!type) return;

    switch (type) {
      case EXPENSE_SPLITT_EQUALLY:
        this.#handleEquallyClick(event);
        break;
      case EXPENSE_SPLITT_PARTS:
        this.#handlePartsClick(event);
        break;
      case EXPENSE_SPLITT_SHARES:
        this.#handleSharesClick(event);
        break;
      default:
        console.warn('Unknown Splitt Type');
    }
  };

  #handleEquallyClick = event => {
    const userId = this.#parseUserId(event, this.#selectors.equally.ROW);
    this.#controller.handleSplittUpdate({
      splittType: EXPENSE_SPLITT_EQUALLY,
      userId,
    });
  };

  #parseUserId = (event, selector) => {
    const row = event.target.closest(selector);
    if (!row) return;
    const userIdRaw = row.dataset.userId;
    return TypeParser.parseStringToBigInt(userIdRaw);
  };

  #handlePartsClick = event => {
    const userId = this.#parseUserId(event, this.#selectors.parts.ROW);
    if (event.target.matches(this.#selectors.parts.INPUT) || !userId) return;
    this.#controller.handleSplittRowClick(EXPENSE_SPLITT_PARTS, userId);
  };

  #handleSharesClick = event => {
    const userId = this.#parseUserId(event, this.#selectors.shares.ROW);
    if (event.target.matches(this.#selectors.shares.INPUT) || !userId) return;
    this.#controller.handleSplittRowClick(EXPENSE_SPLITT_SHARES, userId);
  };

  // Utils

  #parseSplittType = event => {
    const table = event.target.closest(this.#selectors.global.TABLE);
    if (!table) return;

    const rawType = table.dataset.type;
    return this.#selectors.global.TYPES.get(rawType);
  };

  // Validation

  #validateConfiguration = config => {
    const { controller, selectors } = config;
    if (!controller || !selectors) {
      throw new Error('Both controller and selectors are required');
    }
  };
}

export default ExpenseSplittHandler;
