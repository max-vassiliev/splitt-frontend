import {
  isPositiveNumber,
  isNonEmptyString,
  isNonEmptyStringOrNull,
} from '../../util/SplittValidator.js';

class Group {
  #id;
  #title;
  #avatar;

  constructor({ id, title, avatar }) {
    this.#id = id;
    this.#title = title;
    this.#avatar = avatar;
  }

  /**
   * @param {number} value — Must be a positive number.
   */
  set id(value) {
    if (!isPositiveNumber(value)) {
      throw new Error('Invalid ID: expected a positive number');
    }
    this.#id = value;
  }

  get id() {
    return this.#id;
  }

  /**
   * @param {string} value — Must be a non-empty string.
   */
  set title(value) {
    if (!isNonEmptyString(value)) {
      throw new Error(
        `Invalid value for title: expected a non-empty string. Received: ${value} (type: ${typeof value})`
      );
    }
    this.#title = value;
  }

  get title() {
    return this.#title;
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

export default Group;
