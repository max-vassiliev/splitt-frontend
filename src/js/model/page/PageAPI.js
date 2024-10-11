import {
  API_URL,
  API_PATH_GROUP,
  API_PATH_FULL_PAGE,
  API_HEADER_REQUESTER,
} from '../api/ApiConfig.js';
import { ApiClient } from '../api/ApiClient.js';

class PageAPI {
  /**
   * Performs a GET request to the API to retrieve the full data required to load the page.
   * @param {BigInt} userId — The current user's ID.
   * @param {BigInt} groupId — The current group's ID.
   * @throws {Error} — Throws an error the API request results in an error.
   * @returns {Promise<object>} — The response data as a JSON object.
   */
  async getFullPageData(userId, groupId) {
    try {
      const resource = `${API_URL}/${API_PATH_GROUP}/${groupId.toString()}/${API_PATH_FULL_PAGE}`;
      const options = {
        headers: { [API_HEADER_REQUESTER]: userId.toString() },
      };

      return await ApiClient.get(resource, options);
    } catch (error) {
      throw error;
    }
  }
}

export default new PageAPI();
