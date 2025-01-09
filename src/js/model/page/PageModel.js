import stateManager from '../state/StateManager.js';
import dateManager from '../state/date/DateManager.js';
import pageAPI from './PageAPI.js';
import eventBus from '../../util/EventBus.js';

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
   * Clears the active modal ID and triggers any associated close event.
   *
   * If a custom close event is registered for the active modal, the event is emitted
   * before the active modal ID is set to `null`.
   *
   * @fires eventBus#<string> - Emits the event name associated with the active modal.
   */
  closeActiveModal = () => {
    const closeEvent = stateManager.getActiveModalCloseEvent();
    if (closeEvent) {
      eventBus.emit(closeEvent);
    }
    stateManager.setActiveModalId(null);
  };
}

export default new PageModel();
