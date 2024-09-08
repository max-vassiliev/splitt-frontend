import stateManager from '../state/StateManager.js';
import { IMAGES_PATH, DEFAULT_AVATAR } from '../../util/Config.js';

class UserModel {
  getCurrentUserNameAndAvatar() {
    const currentUser = stateManager.getCurrentUser();
    const { name, avatar } = currentUser;
    const avatarUrl = avatar
      ? `${IMAGES_PATH}${avatar}`
      : `${IMAGES_PATH}${DEFAULT_AVATAR}`;

    return { username: name, avatar: avatarUrl };
  }
}

export default new UserModel();
