import { isNonEmptyString } from '../../../util/SplittValidator.js';

class RepaymentParty {
  #id;
  #name;
  #isCurrentUser;

  constructor(id, name, isCurrentUser) {
    this.#id = id;
    this.#name = name;
    this.#isCurrentUser = isCurrentUser;
  }

  /**
   * Gets the ID of the party.
   * @returns {BigInt}
   */
  get id() {
    return this.#id;
  }

  /**
   * Sets the ID of the party.
   * @param {BigInt} value
   */
  set id(value) {
    if (typeof value !== 'bigint') {
      throw new Error(
        `Invalid value for id: expected a BigInt. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#id = value;
  }

  /**
   * Gets the name of the party.
   * @returns {string}
   */
  get name() {
    return this.#name;
  }

  /**
   * Sets the name of the party.
   * @param {string} value Must be a non-empty string.
   */
  set name(value) {
    if (!isNonEmptyString(value)) {
      throw new Error(
        `Invalid value for name: expected a non-empty string. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#name = value;
  }

  /**
   * Gets whether the party is the current user.
   * @returns {boolean}
   */
  get isCurrentUser() {
    return this.#isCurrentUser;
  }

  /**
   * Sets whether the party is the current user.
   * @param {boolean} value
   */
  set isCurrentUser(value) {
    if (typeof value !== 'boolean') {
      throw new Error(
        `Invalid value for isCurrentUser: expected a boolean. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#isCurrentUser = value;
  }
}

export default RepaymentParty;
