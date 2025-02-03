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
    // TODO! вернуть equally
    this.#activeForm = this.#equally;
    // this.#activeForm = this.#parts;
    this.#initFormsMap();
  }

  #initFormsMap = () => {
    this.#forms = new Map();
    this.#forms.set(EXPENSE_SPLITT_EQUALLY, this.#equally);
    this.#forms.set(EXPENSE_SPLITT_PARTS, this.#parts);
    this.#forms.set(EXPENSE_SPLITT_SHARES, this.#shares);
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
   * @param {string} splittType The splitt type to set as active. See {@link EXPENSE_SPLITT_TYPES}.
   * @throws {Error} If the splitt type is invalid or no form is assigned to the type.
   */
  set activeForm(splittType) {
    if (!EXPENSE_SPLITT_TYPES.has(splittType)) {
      throw new Error(`Invalid Splitt type: ${splittType}.`);
    }

    const form = this.#forms.get(splittType);
    if (!form) {
      console.warn(`No form assigned to the type: ${splittType}.`);
      return;
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
