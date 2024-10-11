import stateManager from '../state/StateManager.js';
import pageAPI from './PageAPI.js';

class PageModel {
  async loadPage() {
    try {
      const data = await pageAPI.getFullPageData(4n, 1n);

      stateManager.loadState(data);

      const stateToPrint = stateManager.getState();
      console.log(stateToPrint);
    } catch (error) {
      throw error;
    }
  }
}

export default new PageModel();
