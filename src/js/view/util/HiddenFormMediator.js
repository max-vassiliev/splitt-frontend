import {
  ACTIVE_CLASS,
  TYPE_EXPENSE,
  TYPE_REPAYMENT,
  EXPENSE_HIDDEN_FORM_TYPES,
  REPAYMENT_HIDDEN_FORM_TYPES,
} from '../../util/Config.js';

class HiddenFormMediator {
  #formButtonPairs;
  #validHiddenFormTypes;

  constructor(formType) {
    this.#formButtonPairs = new Map();
    this.#initValidHiddenFormTypes(formType);
  }

  #initValidHiddenFormTypes = formType => {
    switch (formType) {
      case TYPE_EXPENSE:
        this.#validHiddenFormTypes = EXPENSE_HIDDEN_FORM_TYPES;
        break;
      case TYPE_REPAYMENT:
        this.#validHiddenFormTypes = REPAYMENT_HIDDEN_FORM_TYPES;
        break;
      default:
        throw new Error(`Unknown form type: ${formType}.`);
    }
  };

  /**
   * Registers a form-button pair for a specific type.
   * @param {string} type - The type of the form. Must be one of REPAYMENT_HIDDEN_FORM_TYPES.
   * @param {HTMLElement} formElement - The form element to register.
   * @param {HTMLElement} buttonElement - The button element to register.
   * @throws {Error} If the type is invalid or either formElement or buttonElement is not an instance of HTMLElement.
   */
  registerFormButtonPair(type, formElement, buttonElement) {
    this.#validateHTMLElement(formElement, 'formElement');
    this.#validateHTMLElement(buttonElement, 'buttonElement');
    this.#validateType(type);

    this.#formButtonPairs.set(type, {
      form: formElement,
      button: buttonElement,
    });
  }

  /**
   * Opens a form of the given type.
   * @param {string} type - The type of the form to open.
   * @throws {Error} If no form-button pair is registered for the given type.
   */
  openForm = type => {
    this.#validateFormButtonPairType(type);

    const { form, button } = this.#formButtonPairs.get(type);

    form.classList.add(ACTIVE_CLASS);
    button.classList.add(ACTIVE_CLASS);
  };

  /**
   * Closes the form of the given type.
   * @param {string} [type] - The type of the form to close.
   * @throws {Error} If no form-button pair is registered for the given type.
   */
  closeForm = type => {
    this.#validateFormButtonPairType(type);
    const { form, button } = this.#formButtonPairs.get(type);

    form.classList.remove(ACTIVE_CLASS);
    button.classList.remove(ACTIVE_CLASS);
  };

  /**
   * Closes all forms.
   */
  closeAll = () => {
    this.#formButtonPairs.forEach(pair => {
      pair.form.classList.remove(ACTIVE_CLASS);
      pair.button.classList.remove(ACTIVE_CLASS);
    });
  };

  /**
   * Validates if the type is one of valid hidden form types.
   * @param {string} type - The type to validate.
   * @throws {Error} If the type is invalid.
   */
  #validateType(type) {
    if (!this.#validHiddenFormTypes.has(type)) {
      throw new Error(
        `Invalid form type: ${type}. Expected one of ${this.#validHiddenFormTypes.join(
          ', '
        )}. Received: ${type} (${typeof type}).`
      );
    }
  }

  /**
   * Validates if the element is an instance of HTMLElement.
   * @param {HTMLElement} element - The element to validate.
   * @param {string} elementName - The name of the element for the error message.
   * @throws {Error} If the element is not an instance of HTMLElement.
   */
  #validateHTMLElement(element, elementName) {
    if (!(element instanceof HTMLElement)) {
      throw new Error(
        `Invalid ${elementName}: expected an instance of HTMLElement. Received: ${element} (${typeof element}).`
      );
    }
  }

  /**
   * Validates if the form-button pair for a given type is registered.
   * @param {string} type - The type to validate.
   * @throws {Error} If no form-button pair is registered for the given type.
   */
  #validateFormButtonPairType = type => {
    if (!this.#formButtonPairs.has(type)) {
      throw new Error(`No form-button pair registered for type: ${type}`);
    }
  };
}

export default HiddenFormMediator;
