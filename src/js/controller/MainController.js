import pageController from './PageController.js';
import headerController from './HeaderController.js';
import groupController from './GroupController.js';
import summaryController from './SummaryController.js';

class MainController {
  #setupEventListeners() {
    headerController.on('groupSettingsLinkClick', () => {
      groupController.openGroupModal();
    });
  }

  async init() {
    try {
      await pageController.init();

      headerController.init();
      groupController.init();
      summaryController.init();

      this.#setupEventListeners();
    } catch (error) {
      throw error;
    }
  }
}

export default new MainController();
