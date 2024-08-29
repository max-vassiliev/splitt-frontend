import pageModel from '../model/page/PageModel.js';

class PageController {
  async controlLoadPage() {
    try {
      await pageModel.loadPage();
    } catch (error) {
      throw error;
    }
  }

  async init() {
    await this.controlLoadPage();
  }
}

export default new PageController();
