import stateManager from '../state/StateManager.js';
import dateManager from '../form/date/DateManager.js';
import pageAPI from './PageAPI.js';

class PageModel {
  /**
   * Loads the full initial page data from the API
   * and initializes the application state.
   *
   * @returns {Promise<void>}
   * @throws Will re-throw any errors from the API call.
   */
  loadPage = async () => {
    try {
      const data = await pageAPI.getFullPageData(4n, 1n);
      stateManager.loadState(data);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Loads an incremental demo update from the API
   * and updates the application state accordingly.
   *
   * @returns {Promise<void>}
   * @throws Will re-throw any errors from the API call.
   */
  updatePageDemo = async () => {
    try {
      const data = await pageAPI.getPageUpdateData();
      stateManager.updateAfterAddTransactionDemo(data);
    } catch (error) {
      throw error;
    }
  };

  /**
   * Initializes the global date settings for the page.
   */
  initDate = () => {
    dateManager.init();
  };

  /**
   * Gets the app's global settings.
   * @returns {Object} The object with the app's global settings.
   * @property {string} locale The current locale.
   * @property {string} currencySymbol The currency symbol for transactions in the group.
   */
  getAppSettings = () => {
    return stateManager.getLocaleAndCurrencySymbol();
  };

  /**
   * Gets the active modal ID.
   * @returns {number|null} An the active modal ID or null.
   */
  getActiveModalId = () => {
    return stateManager.getActiveModalId();
  };

  /**
   * Sets the currently active modal ID.
   * @param {number} modalId — The modal ID to set as active.
   */
  setActiveModalId = modalId => {
    stateManager.setActiveModalId(modalId);
  };

  /**
   * Clears the active modal ID setting it to `null`.
   */
  closeActiveModal = () => {
    stateManager.setActiveModalId(null);
  };
}

export default new PageModel();
