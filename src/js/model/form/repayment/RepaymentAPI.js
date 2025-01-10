import {
  API_URL,
  API_HEADER_REQUESTER,
  API_PATH_GROUP,
  API_PATH_REPAYMENT,
} from '../../api/ApiConfig.js';
import { ApiClient } from '../../api/ApiClient.js';

class RepaymentAPI {
  /**
   * Performs a GET request to the API to the full infomation about the specified repayment.
   * @param {Object} params — An object with required parameters.
   * @param {bigint} params.repaymentId — The repayment ID.
   * @param {bigint} params.groupId — Current group ID.
   * @param {bigint} params.userId — Current user ID.
   * @throws {Error} — Throws an error the API request results in an error.
   * @returns {Promise<Object>} — The response data as a JSON object with full data on the repayment.
   */
  async getById({ repaymentId, groupId, userId }) {
    try {
      const resource = `${API_URL}/${API_PATH_GROUP}/${groupId.toString()}/${API_PATH_REPAYMENT}/${repaymentId.toString()}`;
      const options = {
        headers: { [API_HEADER_REQUESTER]: userId.toString() },
      };

      return await ApiClient.get(resource, options);
    } catch (error) {
      throw error;
    }
  }
}

export default new RepaymentAPI();
