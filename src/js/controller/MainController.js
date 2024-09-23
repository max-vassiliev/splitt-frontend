import pageController from './PageController.js';
import headerController from './HeaderController.js';
import groupController from './GroupController.js';
import summaryController from './SummaryController.js';
import transactionsController from './TransactionsController.js';
import paginationController from './pagination/PaginationController.js';

class MainController {
  async init() {
    try {
      await pageController.init();

      headerController.init();
      groupController.init();
      summaryController.init();
      transactionsController.init();
      paginationController.init();

      this.#bindEventHandlers();
    } catch (error) {
      throw error;
    }
  }

  #bindEventHandlers() {
    headerController.on('groupSettingsLinkClick', () => {
      groupController.openGroupModal();
    });
  }
}

export default new MainController();
