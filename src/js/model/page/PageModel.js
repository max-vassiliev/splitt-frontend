import stateManager from '../state/StateManager.js';
import dateManager from '../state/date/DateManager.js';
import pageAPI from './PageAPI.js';

class PageModel {
  loadPage = async () => {
    try {
      const data = await pageAPI.getFullPageData(4n, 1n);

      stateManager.loadState(data);

      const stateToPrint = stateManager.getState();
      console.log(stateToPrint);
    } catch (error) {
      throw error;
    }
  };

  initDate = () => {
    dateManager.init();
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
