import pageModel from '../model/page/PageModel.js';

class PageController {
  async controlLoadPage() {
    try {
      const data = await pageModel.loadPage();
      console.log(data);
      // TODO!
    } catch (error) {
      throw error;
    }
  }

  async init() {
    await this.controlLoadPage();
  }
}

export default new PageController();
