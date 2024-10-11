import pageModel from '../../model/page/PageModel.js';

class PageController {
  async init() {
    await this.controlLoadPage();
  }

  async controlLoadPage() {
    try {
      await pageModel.loadPage();
    } catch (error) {
      throw error;
    }
  }
}

export default new PageController();
