import balanceModel from '../../model/balance/UserBalanceModel.js';
import userSummaryView from '../../view/summary/UserSummaryView.js';
import groupSummaryView from '../../view/summary/GroupSummaryView.js';
import eventBus from '../../util/EventBus.js';

class SummaryController {
  init() {
    this.#loadData();
    this.#bindEventHandlers();
  }

  // Load

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

  // Bind Event Handlers

  #bindEventHandlers() {
    userSummaryView.addHandlerContainerClick(this.#handleContainerClick);
  }

  // Handlers

  #handleContainerClick = event => {
    const selectedUserId = userSummaryView.getSelectedUserId(event.target);
    if (!selectedUserId) return;
    eventBus.emit('settleDebt', selectedUserId);
  };

  handleLoading = () => {
    userSummaryView.renderLoading();
    groupSummaryView.renderLoading();
  };

  handleUpdate = () => {
    this.#loadData();
  };
}

export default new SummaryController();
