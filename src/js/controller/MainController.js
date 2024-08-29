import pageController from './PageController.js';

class MainController {
  async init() {
    try {
      await pageController.init();
    } catch (error) {
      throw error;
    }
  }
}

export default new MainController();
