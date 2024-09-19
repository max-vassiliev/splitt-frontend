import transactionModel from '../model/transaction/TransactionModel.js';
import transactionsView from '../view/transactions/TransactionsView.js';
import transactionsHandler from './handler/TransactionsHandler.js';

class TransactionsController {
  init() {
    this.#loadData();
    this.#bindEventHandlers();
  }

  #loadData() {
    const data = transactionModel.getTransactionsLoadData();
    transactionsView.render(data);
  }

  #bindEventHandlers() {
    transactionsView.addHandlerContainerClick(
      transactionsHandler.handleContainerClick
    );
  }
}

export default new TransactionsController();
