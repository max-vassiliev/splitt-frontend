import stateManager from '../state/StateManager.js';

class UserModel {
  getCurrentUserNameAndAvatar() {
    const currentUser = stateManager.getCurrentUser();
    const { name: username, avatar } = currentUser;
    return { username, avatar };
  }
}

export default new UserModel();
