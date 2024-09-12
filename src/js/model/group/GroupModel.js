import stateManager from '../state/StateManager.js';

class GroupModel {
  /**
   * Gets the current group's ID.
   * @returns {BigInt} The groups ID.
   */
  getCurrentGroupId() {
    const { id } = stateManager.getGroup();
    return id;
  }

  /**
   * Gets the current group's title and avatar URL.
   * @returns {Object} An object with the fields: title (string) and avatar (string).
   */
  getCurrentGroupTitleAndAvatar() {
    const { title, avatar } = stateManager.getGroup();
    return { title, avatar };
  }
}

export default new GroupModel();
