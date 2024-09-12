import stateManager from '../state/StateManager.js';

class UserModel {
  /**
   * Gets the current user's name and avatar URL.
   * @returns {Object} An object with the fields: username (string) and avatar (string).
   */
  getCurrentUserNameAndAvatar() {
    const currentUser = stateManager.getCurrentUser();
    const { name, avatar } = currentUser;
    return { username: name, avatar };
  }
}

export default new UserModel();
