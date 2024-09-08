import stateManager from '../state/StateManager.js';
import { IMAGES_PATH, DEFAULT_AVATAR } from '../../util/Config.js';

class GroupModel {
  getCurrentGroupId() {
    const { id } = stateManager.getGroup();
    return id;
  }

  getCurrentGroupTitleAndAvatar() {
    const { title, avatar } = stateManager.getGroup();
    const avatarUrl = avatar
      ? `${IMAGES_PATH}${avatar}`
      : `${IMAGES_PATH}${DEFAULT_AVATAR}`;

    return { title, avatar: avatarUrl };
  }
}

export default new GroupModel();
