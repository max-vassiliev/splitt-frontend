import balanceModel from '../model/balance/UserBalanceModel';
import userSummaryView from '../view/UserSummaryView.js';
import groupSummaryView from '../view/GroupSummaryView.js';
import userSummaryHandler from './handler/UserSummaryHandler.js';

class SummaryController {
  init() {
    this.#loadData();
    this.#setupHandlers();
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

  #setupHandlers() {
    userSummaryView.addHandlerContainerClick(
      userSummaryHandler.handleContainerClick
    );
  }
}

export default new SummaryController();
