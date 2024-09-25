import {
  MOCK_PAGE_LOAD_DATA,
  MOCK_GET_FULL_PAGE_URL,
} from './MockAjaxConfig.js';

class MockAjax {
  #pathsGet;

  constructor() {
    this.#pathsGet = new Map([[MOCK_GET_FULL_PAGE_URL, MOCK_PAGE_LOAD_DATA]]);
  }

  /**
   * Mocks a GET request and returns JSON data based on the provided resource.
   * @param {string} resource — The resource URL for which the GET request is being mocked.
   * @param {Object} options — The options object containing request configurations.
   * @throws {Error} — Throws an error if the correct value for the provided 'resource' is not found in the 'pathsGet' map or if the fetch request fails.
   * @returns {Promise<object>}} — The mock response data as a JSON object.
   */
  async get(resource, options = {}) {
    try {
      const filePath = this.#pathsGet.get(resource);
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
}

export default new MockAjax();
