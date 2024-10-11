import pageController from './page/PageController.js';
import headerController from './header/HeaderController.js';
import groupController from './group/GroupController.js';
import summaryController from './summary/SummaryController.js';
import transactionsController from './transactions/TransactionsController.js';
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
