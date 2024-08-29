import AJAX from '../../util/ajax';
import { PAGE_LOAD_DATA } from '../../util/config';

class PageModel {
  async loadPage() {
    try {
      const data = await AJAX.getTestData(PAGE_LOAD_DATA);
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default new PageModel();
