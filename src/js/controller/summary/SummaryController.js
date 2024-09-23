import balanceModel from '../../model/balance/UserBalanceModel.js';
import userSummaryView from '../../view/summary/UserSummaryView.js';
import groupSummaryView from '../../view/summary/GroupSummaryView.js';
import userSummaryHandler from './handler/UserSummaryHandler.js';

class SummaryController {
  init() {
    this.#loadData();
    this.#bindEventHandlers();
  }

  #loadData() {
    this.#loadUserSummaryData();
    this.#loadGroupSummaryData();
  }

  #loadUserSummaryData() {
    const data = balanceModel.getUserSummaryData();
    userSummaryView.render(data);
  }

  #loadGroupSummaryData() {
    const data = balanceModel.getGroupSummaryData();
    groupSummaryView.render(data);
  }

  #bindEventHandlers() {
    userSummaryView.addHandlerContainerClick(
      userSummaryHandler.handleContainerClick
    );
  }
}

export default new SummaryController();
