import { MOCK_DATA_PAGE_FULL, MOCK_DATA_GROUPS } from './MockAjaxConfig.js';
import { API_URL, API_PATH_GROUP, API_PATH_FULL_PAGE } from '../ApiConfig.js';

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

    this.#mockDataGet.set(fullPageEndpoint, MOCK_DATA_PAGE_FULL);
    this.#mockDataGet.set(groupsEndpoint, MOCK_DATA_GROUPS);
  }
}

export default new MockAjax();
