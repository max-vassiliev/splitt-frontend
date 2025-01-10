import {
  isNonEmptyString,
  isNonEmptyStringOrNull,
} from '../../util/SplittValidator.js';
import TypeParser from '../../util/TypeParser.js';

class User {
  #id;
  #name;
  #email;
  #avatar;

  /**
   * Sets the user's ID as a BigInt.
   * @param {number | BigInt} value — Must be a positive number or BigInt value.
   */
  set id(value) {
    this.#id = TypeParser.parseId(value);
  }

  /**
   * Gets the user's ID.
   * @returns {BigInt} - Returns the user's ID as a BigInt value.
   */
  get id() {
    return this.#id;
  }

  /**
   * Sets the user's name.
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

  /**
   * Gets the user's name.
   * @returns {string} - Returns a string with the user's name.
   */
  get name() {
    return this.#name;
  }

  /**
   * Sets the user's email.
   * @param {string | null} value — Must be a non-empty string or null.
   */
  set email(value) {
    if (!isNonEmptyStringOrNull(value)) {
      throw new Error(
        `Invalid value for email: expected a non-empty string or null. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#email = value;
  }

  /**
   * Gets the user's email.
   * @returns {string|null} - Returns a string with the email or null.
   */
  get email() {
    return this.#email;
  }

  /**
   * Sets the user's avatar URL.
   * @param {string|null} value — Must be a non-empty string or null.
   */
  set avatar(value) {
    if (!isNonEmptyStringOrNull(value)) {
      throw new Error(
        `Invalid value for avatar: expected a non-empty string or null. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#avatar = value;
  }

  /**
   * Gets the user's avatar URL without the full path.
   * @returns {string|null} - Returns a string with the avatar URL or null.
   */
  get avatar() {
    return this.#avatar;
  }
}

export default User;
