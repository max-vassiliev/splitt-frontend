import TypeParser from '../../../util/TypeParser.js';

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

  handleTableInput = event => {};

  // Event Handlers: Change

  handleTableChange = event => {
    if (!event.target.matches(this.#selectors.PAYER_SWITCH)) return;
    this.#handlePayerUpdate(event);
  };

  #handlePayerUpdate = event => {
    if (!event.target.matches(this.#selectors.PAYER_SWITCH)) return;
    const row = event.target.closest(this.#selectors.PAYER_ROW);
    const entryId = parseInt(row.dataset.entryId, 10);
    const newPayerId = TypeParser.parseStringToBigInt(event.target.value);
    this.#controller.handlePayerUpdate(entryId, newPayerId);
  };

  // Event Handlers: Click

  handleTableClick = event => {
    if (event.target.closest(this.#selectors.ADD_PAYER_ROW)) {
      this.#handleAddPayerRow();
    }
    // avatar
    // delete row
  };

  #handleAddPayerRow = () => {
    this.#controller.handleAddPayerRow();
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
