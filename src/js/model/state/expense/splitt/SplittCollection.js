import {
  EXPENSE_SPLITT_TYPES,
  EXPENSE_SPLITT_EQUALLY,
  EXPENSE_SPLITT_PARTS,
  EXPENSE_SPLITT_SHARES,
} from '../../../../util/Config.js';
import SplittEquallyState from './SplittEquallyState.js';
import SplittPartsState from './SplittPartsState.js';
import SplittSharesState from './SplittSharesState.js';
import SplittState from './SplittState.js';

class SplittCollection {
  #activeForm;
  #equally;
  #parts;
  #shares;
  #forms;

  constructor() {
    this.#equally = new SplittEquallyState();
    this.#parts = new SplittPartsState();
    this.#shares = new SplittSharesState();
    this.#activeForm = this.#equally;
    this.#initFormsMap();
  }

  #initFormsMap = () => {
    this.#forms = new Map();
    this.#forms.set(EXPENSE_SPLITT_EQUALLY, this.#equally);
    this.#forms.set(EXPENSE_SPLITT_PARTS, this.#parts);
    this.#forms.set(EXPENSE_SPLITT_SHARES, this.#shares);
  };

  /**
   * Resets the entire Splitt Collection by resetting each form
   * and setting the active form to "equally".
   *
   * @returns {void}
   */
  reset = () => {
    this.#equally.reset();
    this.#parts.reset();
    this.#shares.reset();
    this.#activeForm = this.#equally;
  };

  /**
   * Retrieves the splitt form by it's type.
   * @param {string} type The type of the splitt form. See {@link EXPENSE_SPLITT_TYPES}.
   * @returns {Object} One of the splitt form state assigned to the type.
   * @throws {Error} If the splitt type is invalid or no form is assigned to the type.
   */
  getForm = type => {
    if (!EXPENSE_SPLITT_TYPES.has(type)) {
      throw new Error(`Invalid Splitt type: ${type}.`);
    }

    const form = this.#forms.get(type);
    if (!form) {
      throw new Error(`No form assigned to the type: ${type}.`);
    }

    return form;
  };

  /**
   * Gets the active splitt form state.
   * @returns {SplittState} The active splitt form state. Child classes of {@link SplittState}.
   */
  get activeForm() {
    return this.#activeForm;
  }

  /**
   * Sets the active splitt form state.
   * @param {object} form The form instance to set as active.
   * @throws {Error} If the provided form is not one of the registered forms.
   */
  set activeForm(form) {
    if (![...this.#forms.values()].includes(form)) {
      throw new Error('Invalid form: The provided form is not registered.');
    }
    this.#activeForm = form;
  }

  /**
   * Gets the splitt equally form state.
   * @returns {SplittEquallyState} The splitt equally form state.
   */
  get equally() {
    return this.#equally;
  }

  /**
   * Gets the splitt parts form state.
   * @returns {SplittPartsState} The splitt parts form state.
   */
  get parts() {
    return this.#parts;
  }

  /**
   * Gets the splitt shares form state.
   * @returns {SplittSharesState} The splitt shares form state.
   */
  get shares() {
    return this.#shares;
  }
}

export default SplittCollection;
