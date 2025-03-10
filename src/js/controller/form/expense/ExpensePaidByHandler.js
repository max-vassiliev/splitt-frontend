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

  #validateConfiguration = config => {
    const { controller, selectors } = config;
    if (!controller || !selectors) {
      throw new Error('Both controller and selectors are required');
    }
  };

  handlePayerSwitch = event => {
    const row = event.target.closest(this.#selectors.PAYER_ROW);
    const entryId = parseInt(row.dataset.entryId, 10);
    const newPayerId = TypeParser.parseStringToBigInt(event.target.value);
    this.#controller.updatePayer(entryId, newPayerId);
  };
}

export default ExpensePaidByHandler;
