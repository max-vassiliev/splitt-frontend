import User from './User.js';

class UserManager {
  #requiredFields = ['id', 'name'];

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

  #initializeUser(inputData) {
    this.#validateUser(inputData);

    const user = new User();
    user.id = inputData.id;
    user.name = inputData.name;
    user.email = inputData.email;
    user.avatar = inputData.avatar;

    return user;
  }

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
