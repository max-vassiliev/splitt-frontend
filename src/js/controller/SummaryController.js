import balanceModel from '../model/balance/UserBalanceModel';
import groupStatsView from '../view/GroupStatsView.js';

class SummaryController {
  #loadUserSummaryData() {
    //
    return;
  }

  #loadGroupStatsData() {
    const data = balanceModel.getGroupStatsData();
    groupStatsView.renderGroupStats(data);
  }

  #loadData() {
    this.#loadUserSummaryData();
    this.#loadGroupStatsData();
  }

  #setupHandlers() {
    // TODO! нужно для UserStatus
    return;
  }

  init() {
    this.#loadData();
    this.#setupHandlers();
  }
}

export default new SummaryController();
