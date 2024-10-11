import stateManager from '../state/StateManager.js';
import groupAPI from './GroupAPI.js';

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
   * Gets the current group's data.
   * @returns {Object} An object with the fields: id, title and avatar.
   */
  getCurrentGroupData() {
    const { id, title, avatar } = stateManager.getGroup();
    return { id, title, avatar };
  }

  /**
   * Checks the current user's group options.
   *
   * Returns null, if group options are already loaded.
   * Otherwise, fetches the group options from the API, loads them into the state and then returns the loaded group options.
   *
   * @async
   * @returns {null|Promise<Array<GroupOption>|null>} Null if the data was already loaded or a promise that resolves to the group options array if the data was fetched and loaded.
   */
  async getGroupOptions() {
    if (stateManager.isGroupOptionsLoaded()) return null;

    const userId = stateManager.getUserId();

    try {
      const data = await groupAPI.getGroupOptions(userId);
      stateManager.loadGroupOptions(data);

      return stateManager.getGroupOptions();
    } catch (error) {
      console.error('Error loading group options:', error);
    }
  }
}

export default new GroupModel();
