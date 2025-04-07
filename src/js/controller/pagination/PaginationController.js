import paginationModel from '../../model/pagination/PaginationModel.js';
import paginationView from '../../view/pagination/PaginationView.js';
import paginationHandler from './PaginationHandler.js';

class PaginationController {
  init() {
    this.#loadData();
    this.#bindEventHandlers();
  }

  #loadData() {
    const settings = paginationModel.getPaginationSettings();
    paginationView.render(settings);
  }

  #bindEventHandlers() {
    paginationView.addHandlerToFirstPageClick(
      paginationHandler.handleClickToFirstPage
    );
    paginationView.addHandlerToPreviousPageClick(
      paginationHandler.handleClickToPreviousPage
    );
    paginationView.addHandlerToNextPageClick(
      paginationHandler.handleClickToNextPage
    );
  }

  handleUpdate = () => {
    this.#loadData();
  };
}

export default new PaginationController();
