import {
  isNonEmptyString,
  isPositiveInteger,
} from '../../util/SplittValidator';
import TypeParser from '../util/TypeParser';

class GroupOption {
  #id;
  #title;
  #order;

  constructor({ id, title }) {
    this.id = id;
    this.title = title;
  }

  /**
   * Gets the group's ID.
   * @returns {BigInt} - Returns a BigInt value.
   */
  get id() {
    return this.#id;
  }

  /**
   * Sets the group's ID as a BigInt.
   * @param {number | BigInt} value — Must be a positive number or BigInt value.
   */
  set id(value) {
    this.#id = TypeParser.parseId(value);
  }

  /**
   * Gets the group's title.
   * @returns {string} - Returns a string with the group's title.
   */
  get title() {
    return this.#title;
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
   * Gets the order of the group option.
   * @returns {Number} — A positive integer.
   */
  get order() {
    return this.#order;
  }

  /**
   * Sets the order of the group option.
   * @param {Number} value — Must be a positive integer.
   * @throws {Error} — If the value is not a positive integer.
   */
  set order(value) {
    if (!isPositiveInteger(value)) {
      throw new Error(
        `Invalid order. Expected a whole positive number. Received: ${value} (${typeof value}).`
      );
    }
    this.#order = value;
  }
}

export default GroupOption;
