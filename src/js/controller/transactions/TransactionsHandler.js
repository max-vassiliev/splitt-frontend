import eventBus from '../../util/EventBus.js';

class TransactionsHandler {
  constructor() {
    this.handleContainerClick = this.handleContainerClick.bind(this);
  }

  handleContainerClick(event) {
    if (event.target.classList.contains('transactions-table__delete-btn')) {
      this.#handleRemoveTransactionClick(event);
      return;
    }
    const transactionRow = event.target.closest('.transactions-table__row');
    if (transactionRow) {
      this.#handleEditTransactionClick(transactionRow);
      return;
    }
    const transactionsEmpty = event.target.closest('.transactions__empty');
    if (transactionsEmpty) {
      this.#handleEmptyTransactionsTableClick(event);
      return;
    }
  }

  #handleRemoveTransactionClick(event) {
    const rowToDelete = event.target.closest('.transactions-table__row');
    if (rowToDelete.classList.contains('repayment')) {
      console.log('delete repayment (add event: "openDeleteRepayment")');
    } else {
      console.log('delete expense (add event: "openDeleteExpense")');
    }
  }

  #handleEditTransactionClick(transactionRow) {
    if (!transactionRow) return;

    if (transactionRow.classList.contains('repayment')) {
      const repaymentId = transactionRow.dataset.transactionId;
      eventBus.emit('openEditRepayment', repaymentId);
    } else {
      console.log('edit expense');
    }
  }

  #handleEmptyTransactionsTableClick(event) {
    if (event.target.classList.contains('add-expense-link')) {
      eventBus.emit('openAddExpense');
      return;
    }
    if (event.target.classList.contains('add-repayment-link')) {
      eventBus.emit('openAddRepayment');
      return;
    }
  }
}

export default new TransactionsHandler();
