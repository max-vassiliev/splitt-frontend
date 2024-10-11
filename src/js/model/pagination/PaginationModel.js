import stateManager from '../state/StateManager.js';

class PaginationModel {
  /**
   * Gets the pagination settings.
   *
   * @returns {Object} A pagination settings object containing the following fields with boolean values:
   *                     - activateFirstPageControl
   *                     - activatePreviousPageControl
   *                     - activateNextPageControl
   * */
  getPaginationSettings() {
    const { page, transactionsCount, transactionsPerPage } =
      stateManager.getPageData();

    const isFirstPage = page === 1;
    const isFullPage = transactionsCount === transactionsPerPage;

    return {
      activateFirstPageControl: !isFirstPage,
      activatePreviousPageControl: !isFirstPage,
      activateNextPageControl: isFullPage,
    };
  }
}

export default new PaginationModel();
