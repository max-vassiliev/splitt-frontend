import Expense from './Expense.js';
import Repayment from './Repayment.js';
import { AppUtils } from '../../util/AppUtils.js';

class TransactionManager {
  #transactionTypes = new Set(['expense', 'repayment']);
  #requiredFieldsExpense = [
    'id',
    'amount',
    'currentUserBalance',
    'date',
    'emoji',
    'title',
  ];
  #requiredFieldsRepayment = [
    'id',
    'amount',
    'currentUserBalance',
    'date',
    'emoji',
    'payerId',
    'recipientId',
  ];

  initializeTransactionsOnLoad(transactionsData) {
    if (!Array.isArray(transactionsData)) {
      throw new Error(
        `Invalid transactions data: expected an array. Received: ${transactionsData} (type: ${typeof transactionsData})`
      );
    }
    if (transactionsData.length === 0) return [];
    return transactionsData.map(entry => this.#initializeTransaction(entry));
  }

  #initializeTransaction(input) {
    this.#validateTransactionInput(input);

    return input.type === 'expense'
      ? this.#initializeExpense(input)
      : this.#initializeRepayment(input);
  }

  #initializeExpense(input) {
    this.#validateTransactionInputFields(input);

    const expense = new Expense();
    expense.id = input.id;
    expense.amount = input.amount;
    expense.currentUserBalance = input.currentUserBalance;
    expense.date = AppUtils.parseDate(input.date);
    expense.emoji = input.emoji;
    expense.title = input.title;

    return expense;
  }

  #initializeRepayment(input) {
    this.#validateTransactionInputFields(input, this.#requiredFieldsRepayment);
    const repayment = new Repayment();
    repayment.id = input.id;
    repayment.amount = input.amount;
    repayment.currentUserBalance = input.currentUserBalance;
    repayment.date = AppUtils.parseDate(input.date);
    repayment.emoji = input.emoji;
    repayment.payerId = input.payerId;
    repayment.recipientId = input.recipientId;

    return repayment;
  }

  #validateTransactionInput(input) {
    if (!input || typeof input !== 'object' || !('type' in input)) {
      throw new Error(
        `Invalid or missing transaction type: expected an object with a "type" field. Received: ${input} (type: ${typeof input})`
      );
    }
    if (!this.#transactionTypes.has(input.type)) {
      throw new Error(
        `Invalid transaction type: ${
          input.type
        } (data type: ${typeof input.type})`
      );
    }
  }

  #validateTransactionInputFields(
    input,
    requiredFields = this.#requiredFieldsExpense
  ) {
    requiredFields.forEach(field => {
      if (!(field in input)) {
        throw new Error(
          `Missing required field "${field}" for transaction type "${input.type}"`
        );
      }
    });
  }
}

export default new TransactionManager();
