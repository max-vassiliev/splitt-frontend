import Group from './Group.js';

class GroupManager {
  #requiredFields = ['id', 'title'];

  initializeGroupOnLoad(groupData) {
    if (!groupData || typeof groupData !== 'object') {
      throw Error(
        `Invalid group data. Expected to recieve an object. Received: ${groupData} (type: ${typeof groupData})`
      );
    }
    this.#validateGroupFields(groupData);

    const groupProperties = {
      id: groupData.id,
      title: groupData.title,
      avatar: groupData.avatar,
    };

    return new Group(groupProperties);
  }

  #validateGroupFields(input) {
    this.#requiredFields.forEach(field => {
      if (!(field in input)) {
        throw new Error(`Missing required field "${field}" for Group.`);
      }
    });
  }
}

export default new GroupManager();
