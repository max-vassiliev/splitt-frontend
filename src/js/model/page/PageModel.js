import AJAX from '../../util/Ajax.js';
import { PAGE_LOAD_DATA } from '../../util/Config.js';
import stateManager from '../state/StateManager.js';

class PageModel {
  async loadPage() {
    try {
      const data = await AJAX.getTestData(PAGE_LOAD_DATA);
      stateManager.loadState(data);

      const stateToPrint = stateManager.getState();
      console.log(stateToPrint);
    } catch (error) {
      throw error;
    }
  }
}

export default new PageModel();
