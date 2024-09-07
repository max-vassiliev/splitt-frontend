import pageController from './PageController.js';
import headerController from './HeaderController.js';

class MainController {
  async init() {
    try {
      await pageController.init();
      headerController.init();
    } catch (error) {
      throw error;
    }
  }
}

export default new MainController();
