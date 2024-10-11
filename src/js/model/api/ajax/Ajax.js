import { isNonEmptyString } from '../../../util/SplittValidator.js';
import { API_REQUEST_TIMEOUT } from '../ApiConfig.js';

class AJAX {
  #HEADER_CONTENT_LENGTH = 'Content-Length';
  #HEADER_CONTENT_TYPE = 'Content-Type';
  #HEADER_VALUE_APPLICATION_JSON = 'application/json';
  #FIELD_HEADERS = 'headers';
  #HTTP_STATUS_NO_CONTENT = 204;

  /**
   * Performs a GET request to the specified resource with the given options.
   * @param {string} resource - The resource URL to which the GET request is sent.
   * @param {object} options - The options object containing request configurations.
   * @param {object} options.headers - The headers to include in the request.
   * @returns {Promise<object>} - The response from the GET request.
   */
  async get(resource, options = {}) {
    this.#validateRequestData({
      resource,
      options,
      requiredFields: [this.#FIELD_HEADERS],
    });

    const requestOptions = {
      method: 'GET',
      headers: { ...options.headers },
    };

    return await this.#request(resource, requestOptions);
  }

  /**
   * Performs an HTTP request to the specified resource with the given options.
   * Waits for the response or times out after a specified duration.
   * @param {string} resource - The resource URL to which the request is sent.
   * @param {object} options - The options object containing request configurations.
   * @throws {Error} - Throws an error if the request fails or times out.
   * @returns {Promise<object>} - The processed response from the request.
   */
  async #request(resource, options) {
    try {
      const request = fetch(resource, options);
      const response = await Promise.race([
        request,
        this.#setRequestTimeout(API_REQUEST_TIMEOUT),
      ]);

      const processedResponse = await this.#processResponse(response);
      return processedResponse;
    } catch (error) {
      throw new Error(`Request to ${resource} failed: ${error.message}`);
    }
  }

  /**
   * Sets a timeout for the request.
   * @param {number} seconds - The number of seconds before the request times out.
   * @returns {Promise<never>} - A promise that rejects after the specified timeout.
   */
  #setRequestTimeout(seconds) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Long request. Timeout after ${seconds} seconds.`));
      }, seconds * 1000);
    });
  }

  /**
   * Processes the HTTP response.
   * Checks for successful response and returns the parsed JSON data if applicable.
   * @param {Response} response - The HTTP response to process.
   * @throws {Error} - Throws an error if the response status is not OK.
   * @returns {Promise<object>|object} - The processed response data or an object containing the response status.
   */
  async #processResponse(response) {
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    if (
      response.status === this.#HTTP_STATUS_NO_CONTENT ||
      response.headers.get(this.#HEADER_CONTENT_LENGTH) === '0'
    ) {
      return { ok: response.ok, status: response.status };
    }

    const contentType = response.headers.get(this.#HEADER_CONTENT_TYPE);
    if (contentType?.includes(this.#HEADER_VALUE_APPLICATION_JSON)) {
      const responseData = await response.json();
      return responseData;
    }

    return response;
  }

  /**
   * Validates the request data that will be passed to the API.
   * @param {object} data - The data object to validate.
   * @param {string} data.resource - The resource string to validate.
   * @param {object} data.options - The options object to validate.
   * @param {string[]} [data.requiredFields] - The list of required fields.
   * @throws {Error} Will throw an error if validation fails.
   */
  #validateRequestData(data) {
    const { resource, options, requiredFields } = data;
    if (!isNonEmptyString(resource)) {
      throw new Error(
        `'resource' must be an non-empty string. Received: ${resource} (${typeof resource})`
      );
    }
    if (!options || typeof options !== 'object') {
      throw new Error(
        `'options' must be an object. Received: ${options} (${typeof options})`
      );
    }
    if (!requiredFields) return;
    requiredFields.forEach(field => {
      if (!(field in options)) {
        throw new Error(`'options' missing required field: ${field}`);
      }
    });
  }
}

export default new AJAX();
