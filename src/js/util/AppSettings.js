import { DEFAULT_LOCALE, DEFAULT_CURRENCY_SYMBOL } from './Config.js';
import { isNonEmptyString } from './SplittValidator.js';

class AppSettings {
  #locale;
  #currencySymbol;

  constructor() {
    this.#locale = null;
    this.#currencySymbol = null;
  }

  /**
   * Gets the current locale. If not set, returns the default locale.
   * @returns {string} The current locale.
   */
  get locale() {
    return this.#locale || DEFAULT_LOCALE;
  }

  /**
   * Sets the locale.
   * @param {string} value - The new locale to set.
   */
  set locale(value) {
    if (!isNonEmptyString(value)) {
      throw new TypeError(
        `Locale must be a non-empty string. Received: ${value} (${typeof value}).`
      );
    }
    this.#locale = value;
  }

  /**
   * Gets the current currency symbol. If not set, returns the default currency symbol.
   * @returns {string} The current currency symbol.
   */
  get currencySymbol() {
    return this.#currencySymbol || DEFAULT_CURRENCY_SYMBOL;
  }

  /**
   * Sets the currency symbol.
   * @param {string} value - The new currency symbol to set.
   */
  set currencySymbol(value) {
    if (!isNonEmptyString(value)) {
      throw new TypeError(
        `The currency symbol must be a non-empty string. Received: ${value} (${typeof value}).`
      );
    }
    this.#currencySymbol = value;
  }
}

export default new AppSettings();
