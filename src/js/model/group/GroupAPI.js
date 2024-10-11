import {
  API_URL,
  API_PATH_GROUP,
  API_HEADER_REQUESTER,
} from '../api/ApiConfig.js';
import { ApiClient } from '../api/ApiClient.js';

class GroupAPI {
  /**
   * Performs a GET request to the API to retrieve all groups of the specified user.
   * @param {BigInt} userId — The user's ID.
   * @throws {Error} — Throws an error the API request results in an error.
   * @returns {Promise<Array<Object>>} — The response data as an array of JSON objects.
   */
  async getGroupOptions(userId) {
    try {
      const resource = `${API_URL}/${API_PATH_GROUP}`;
      const options = {
        headers: { [API_HEADER_REQUESTER]: userId.toString() },
      };

      return await ApiClient.get(resource, options);
    } catch (error) {
      throw error;
    }
  }
}

export default new GroupAPI();
