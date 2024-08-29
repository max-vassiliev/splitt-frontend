import AJAX from '../../util/ajax';
import { PAGE_LOAD_DATA } from '../../util/config';
import stateManager from '../state/StateManager.js';

class PageModel {
  async loadPage() {
    try {
      const data = await AJAX.getTestData(PAGE_LOAD_DATA);
      stateManager.loadState(data);
    } catch (error) {
      throw error;
    }
  }
}

export default new PageModel();
