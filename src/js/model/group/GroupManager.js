import Group from './Group.js';
import GroupOption from './GroupOption.js';

class GroupManager {
  #requiredFields = ['id', 'title'];

  /**
   * Initializes a Group instance from the provided group data object.
   *
   * @param {Object} groupData The data object containing the group's information.
   * @param {bigint} groupData.id The ID of the group.
   * @param {string} groupData.title The title of the group.
   * @param {string} [groupData.avatar] The avatar URL of the group.
   * @returns {Group} A new Group instance initialized with the provided data.
   * @throws {Error} Throws an error if the provided data is not an object or if required fields are missing.
   */
  initializeGroupOnLoad(groupData) {
    if (!groupData || typeof groupData !== 'object') {
      throw new Error(
        `Invalid group data. Expected to recieve an object. Received: ${groupData} (type: ${typeof groupData})`
      );
    }
    this.#validateGroupFields(groupData, Group);

    const groupProperties = {
      id: groupData.id,
      title: groupData.title,
      avatar: groupData.avatar,
    };

    return new Group(groupProperties);
  }

  /**
   * Initializes the group options from an array of group objects.
   * Each object is converted into a GroupOption instance and stored in a Map.
   * If the object has the same ID as the current group, it is excluded from the Map.
   *
   * @param {Array<Object>} groups An array of group objects parsed from JSON, each containing at least an id and title.
   * @param {BigInt} currentGroupId The ID of the current group to exclude from the options.
   * @returns {Map<bigint, GroupOption>} A Map containing GroupOption instances indexed by their IDs or an empty map.
   */
  initializeGroupOptions(groups, currentGroupId) {
    this.#validateGroupOptions(groups, currentGroupId);

    const groupOptions = new Map();
    let groupOptionsCount = 1;
    let isCurrentGroupPresent = false;

    groups.forEach(group => {
      this.#validateGroupFields(group, GroupOption);
      const option = new GroupOption({ id: group.id, title: group.title });
      if (option.id === currentGroupId) {
        isCurrentGroupPresent = true;
        return;
      }
      option.order = groupOptionsCount++;
      groupOptions.set(option.id, option);
    });

    this.#validateCurrentGroupPresent({
      isPresent: isCurrentGroupPresent,
      currentGroupId,
      groups,
    });

    return groupOptions;
  }

  /**
   * Validates an object that is to be converted into group instance.
   * Checks that the necessary fields are present in the object parsed from JSON.
   * @param {Object} input — The object parsed from JSON.
   * @param {Function} groupClass — The class that the object is expected to be converted into.
   *                                This should be a constructor function for Group or GroupOption class.
   * @throws {Error} If any required fields are missing from the input object.
   */
  #validateGroupFields(input, groupClass) {
    this.#requiredFields.forEach(field => {
      if (!(field in input)) {
        throw new Error(`Missing required field "${field}" for ${groupClass}.`);
      }
    });
  }

  /**
   * Validates the input data for group options and the current group ID.
   *
   * @param {Array<Object>} groups - An array of group objects parsed from JSON.
   *                                 Expected to be a non-empty array.
   * @param {BigInt} currentGroupId - The ID of the current group to check.
   * @throws {Error} Throws an error if:
   *                 1) The input 'groups' is not a non-empty array.
   *                 2) The 'currentGroupId' is not a BigInt.
   */
  #validateGroupOptions(groups, currentGroupId) {
    if (!Array.isArray(groups) || groups.length === 0) {
      throw new Error(
        `Invalid group options data. Expected to receive an non-empty array. Received: ${this.#stringify(
          groups
        )} (${typeof groups}).`
      );
    }
    if (typeof currentGroupId !== 'bigint') {
      throw new Error(
        `Invalid current group ID. Expected a BigInt. Received: ${currentGroupId} (${typeof currentGroupId}).`
      );
    }
  }

  /**
   * Logs an error if the current group ID is not present in the list of group options.
   * This function is used within {@link initializeGroupOptions}.
   *
   * @param {boolean} isPresent True if the current group ID is found, otherwise false.
   * @param {Array<Object>} groups An array of group objects parsed from JSON.
   * @see {@link initializeGroupOptions}
   */
  #validateCurrentGroupPresent({ isPresent, currentGroupId, groups }) {
    if (isPresent) return;
    console.error(
      `Current group ID (${currentGroupId}) not found in the received group options: ${this.#stringify(
        groups
      )})}`
    );
  }

  /**
   * Stringifies the input data for group options.
   * @param {Array<Object>} groups An array of group objects parsed from JSON.
   * @returns {String} The array of group options as a string
   */
  #stringify(groups) {
    return JSON.stringify(groups, null, 2);
  }
}

export default new GroupManager();
