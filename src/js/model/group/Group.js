import {
  isNonEmptyString,
  isNonEmptyStringOrNull,
} from '../../util/SplittValidator.js';
import TypeParser from '../util/TypeParser.js';

class Group {
  #id;
  #title;
  #avatar;

  constructor({ id, title, avatar }) {
    this.id = id;
    this.title = title;
    this.avatar = avatar;
  }

  /**
   * Sets the group's ID as a BigInt.
   * @param {number | BigInt} value — Must be a positive number or BigInt value.
   */
  set id(value) {
    this.#id = TypeParser.parseId(value);
  }

  /**
   * Gets the group's ID.
   * @returns {BigInt} - Returns a BigInt value.
   */
  get id() {
    return this.#id;
  }

  /**
   * Sets the group's title.
   * @param {string} value — Must be a non-empty string.
   * @throws {Error} - Throws an error if the title is not a non-empty string.
   */
  set title(value) {
    if (!isNonEmptyString(value)) {
      throw new Error(
        `Invalid value for title: expected a non-empty string. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#title = value;
  }

  /**
   * Gets the group's title.
   * @returns {string} - Returns a string with the group's title.
   */
  get title() {
    return this.#title;
  }

  /**
   * Sets the group's avatar URL without the full path.
   * @param {string} value — Must be a non-empty string or null.
   * @throws {Error} - Throws an error if the value is not a non-empty string or null.
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
   * Gets the group's avatar URL without the full path.
   * @returns {string} - Returns a string with the avatar URL.
   */
  get avatar() {
    return this.#avatar;
  }
}

export default Group;
