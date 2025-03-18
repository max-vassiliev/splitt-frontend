import TypeParser from '../../../util/TypeParser.js';
import { INACTIVE_CLASS } from '../../../util/Config.js';

class ExpensePaidByHandler {
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
    if (event.target.matches(this.#selectors.PAYER_AMOUNT_INPUT)) {
      this.#handlePayerAmountInput(event);
    }
  };

  #handlePayerAmountInput = event => {
    const entryId = this.#parseEntryId(event);
    const inputAmount = event.target.value;
    const cursorPosition = event.target.selectionStart;
    this.#controller.handlePayerAmountInput(
      entryId,
      inputAmount,
      cursorPosition
    );
  };

  // Event Handlers: Change

  handleTableChange = event => {
    if (event.target.matches(this.#selectors.PAYER_SWITCH)) {
      this.#handlePayerUpdate(event);
    }
  };

  #handlePayerUpdate = event => {
    const entryId = this.#parseEntryId(event);
    const newPayerId = TypeParser.parseStringToBigInt(event.target.value);
    this.#controller.handlePayerUpdate(entryId, newPayerId);
  };

  // Event Handlers: Click

  handleTableClick = event => {
    if (event.target.closest(this.#selectors.ADD_PAYER_BUTTON)) {
      this.#handleAddPayerRow();
      return;
    }
    if (event.target.closest(this.#selectors.REMOVE_PAYER_CELL)) {
      this.#handleRemovePayerRow(event);
      return;
    }
    if (event.target.closest(this.#selectors.PAYER_AVATAR_CELL)) {
      this.#handlePayerAvatarClick(event);
    }
  };

  #handleAddPayerRow = () => {
    this.#controller.handleAddPayerRow();
  };

  #handleRemovePayerRow = event => {
    const removePayerCell = event.target.closest(
      this.#selectors.REMOVE_PAYER_CELL
    );
    if (removePayerCell.classList.contains(INACTIVE_CLASS)) return;
    const entryId = this.#parseEntryId(event);
    this.#controller.handleRemovePayerRow(entryId);
  };

  #handlePayerAvatarClick = event => {
    const entryId = this.#parseEntryId(event);
    this.#controller.handlePayerAvatarClick(entryId);
  };

  // Utils

  #parseEntryId = event => {
    const row = event.target.closest(this.#selectors.PAYER_ROW);
    return parseInt(row.dataset.entryId, 10);
  };

  // Validation

  #validateConfiguration = config => {
    const { controller, selectors } = config;
    if (!controller || !selectors) {
      throw new Error('Both controller and selectors are required');
    }
  };
}

export default ExpensePaidByHandler;
