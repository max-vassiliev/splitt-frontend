import { DISABLED_ATTRIBUTE } from '../../util/Config';

class PaginationHandler {
  constructor() {
    this.handleClickToFirstPage = this.handleClickToFirstPage.bind(this);
    this.handleClickToPreviousPage = this.handleClickToPreviousPage.bind(this);
    this.handleClickToNextPage = this.handleClickToNextPage.bind(this);
  }

  handleClickToFirstPage(event) {
    if (event.target.classList.contains(DISABLED_ATTRIBUTE)) return;
    console.log('first page');
  }

  handleClickToPreviousPage(event) {
    if (event.target.classList.contains(DISABLED_ATTRIBUTE)) return;
    console.log('previous page');
  }

  handleClickToNextPage(event) {
    if (event.target.classList.contains(DISABLED_ATTRIBUTE)) return;
    console.log('next page');
  }
}

export default new PaginationHandler();
