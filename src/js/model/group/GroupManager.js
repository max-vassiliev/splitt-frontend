import Group from './Group.js';
import state from '../state/State.js';

class GroupManager {
  createGroupOnLoad(groupData) {
    if (!groupData) {
      throw Error('Unable to load the page with missing group data.');
    }

    const groupProperties = {
      id: groupData.id,
      title: groupData.title,
      avatar: groupData.avatar,
    };

    return new Group(groupProperties);
  }
}

export default new GroupManager();
