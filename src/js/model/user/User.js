import {
  isNonEmptyString,
  isNonEmptyStringOrNull,
  isPositiveNumber,
} from '../../util/SplittValidator.js';

class User {
  #id;
  #name;
  #email;
  #avatar;

  get id() {
    return this.#id;
  }

  /**
   * @param {number} value — Must be a positive number.
   */
  set id(value) {
    if (!isPositiveNumber(value)) {
      throw new Error(
        `Invalid ID: expected a positive number. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#id = value;
  }

  /**
   * @param {string} value — Must be a non-empty string.
   */
  set name(value) {
    if (!isNonEmptyString(value)) {
      throw new Error(
        `Invalid value for name: expected a non-empty string. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#name = value;
  }

  get name() {
    return this.#name;
  }

  /**
   * @param {string} value — Must be a non-empty string or null.
   */
  set email(value) {
    if (!isNonEmptyStringOrNull(value)) {
      throw new Error(
        `Invalid value for email: expected a non-empty string or null. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#email = value;
  }

  get email() {
    return this.#email;
  }

  /**
   * @param {string} value — Must be a non-empty string or null.
   */
  set avatar(value) {
    if (!isNonEmptyStringOrNull(value)) {
      throw new Error(
        `Invalid value for avatar: expected a non-empty string or null. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#avatar = value;
  }

  get avatar() {
    return this.#avatar;
  }
}

export default User;
