import User from './User.js';
import { isPositiveNumber } from '../../util/SplittValidator.js';

class UserManager {
  #requiredFields = ['id', 'name'];

  /**
   * Initializes the current user ID, ensuring it is a positive number.
   * @param {number|BigInt} value - The value to be used as the user ID.
   * @returns {BigInt} - Returns the user ID as a BigInt.
   * @throws {Error} - Throws an error if the value is not a positive number.
   */
  initializeCurrentUserIdOnLoad(value) {
    if (!isPositiveNumber(value)) {
      throw new Error(
        `Invalid ID: expected a positive number or BigInt. Received: ${value} (type: ${typeof value})`
      );
    }
    return BigInt(value);
  }

  /**
   * Initializes the members on load by processing the given data.
   * @param {Array<Object>} membersData - Array of user data objects.
   * @returns {Map<BigInt, User>} - Returns a Map of users keyed by their ID.
   * @throws {Error} - Throws an error if the data is not a non-empty array.
   */
  initializeMembersOnLoad(membersData) {
    if (!Array.isArray(membersData) || membersData.length === 0) {
      throw new Error(
        `Invalid members data. Expected a non-empty array. Received: ${membersData} (type: ${typeof membersData})`
      );
    }
    const members = new Map();

    membersData.forEach(entry => {
      const user = this.#initializeUser(entry);
      members.set(user.id, user);
    });

    return members;
  }

  /**
   * Initializes a User object from the provided data.
   * @param {Object} inputData - Data object containing user information.
   * @returns {User} - Returns an initialized User object.
   * @throws {Error} - Throws an error if the input data is invalid.
   */
  #initializeUser(inputData) {
    this.#validateUser(inputData);

    const user = new User();
    user.id = inputData.id;
    user.name = inputData.name;
    user.email = inputData.email;
    user.avatar = inputData.avatar;

    return user;
  }

  /**
   * Validates the provided user data to ensure it meets the required fields.
   * @param {Object} inputData - Data object to be validated.
   * @throws {Error} - Throws an error if the data is invalid or required fields are missing.
   */
  #validateUser(inputData) {
    if (!inputData || typeof inputData !== 'object') {
      throw new Error(
        `Unable to load the page with invalid member's data. Received: ${inputData} (type: ${typeof inputData})`
      );
    }
    this.#requiredFields.forEach(field => {
      if (!(field in inputData)) {
        throw new Error(`Missing required field "${field}" for User.`);
      }
    });
  }
}

export default new UserManager();
