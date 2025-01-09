import {
  MOCK_DATA_PAGE_FULL,
  MOCK_DATA_GROUPS,
  MOCK_DATA_REPAYMENT_10,
} from './MockAjaxConfig.js';
import {
  API_URL,
  API_PATH_GROUP,
  API_PATH_REPAYMENT,
  API_PATH_FULL_PAGE,
} from '../ApiConfig.js';

class MockAjax {
  #mockDataGet;

  constructor() {
    this.#mockDataGet = new Map();
    this.#setMockDataGet();
  }

  /**
   * Mocks a GET request and returns JSON data based on the provided resource.
   * @param {string} resource — The resource URL for which the GET request is being mocked.
   * @param {Object} options — The options object containing request configurations. Not used here, but included to match the signature of the actual API method.
   * @throws {Error} — Throws an error if the correct value for the provided 'resource' is not found in the 'pathsGet' map or if the fetch request fails.
   * @returns {Promise<Object|Array<Object>>} — The mock response data as a JSON object or an array of JSON objects.
   */
  async get(resource, options = {}) {
    try {
      const filePath = this.#mockDataGet.get(resource);
      if (!filePath) {
        throw new Error(
          `Mock data unavailable for resource: ${resource} (${typeof resource})`
        );
      }
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();

      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Adds entries to the #pathsGet map — the mock data files for GET requests.
   */
  #setMockDataGet() {
    const fullPageEndpoint = `${API_URL}/${API_PATH_GROUP}/1/${API_PATH_FULL_PAGE}`;
    const groupsEndpoint = `${API_URL}/${API_PATH_GROUP}`;
    const repayment10 = `${API_URL}/${API_PATH_GROUP}/1/${API_PATH_REPAYMENT}/10`;
    const repayment7 = `${API_URL}/${API_PATH_GROUP}/1/${API_PATH_REPAYMENT}/7`;
    const repayment3 = `${API_URL}/${API_PATH_GROUP}/1/${API_PATH_REPAYMENT}/3`;

    this.#mockDataGet.set(fullPageEndpoint, MOCK_DATA_PAGE_FULL);
    this.#mockDataGet.set(groupsEndpoint, MOCK_DATA_GROUPS);
    this.#mockDataGet.set(repayment10, MOCK_DATA_REPAYMENT_10);
    this.#mockDataGet.set(repayment7, MOCK_DATA_REPAYMENT_10);
    this.#mockDataGet.set(repayment3, MOCK_DATA_REPAYMENT_10);
  }
}

export default new MockAjax();
