import Expense from '../state/expense/Expense.js';
import Repayment from '../state/repayment/Repayment.js';
import TypeParser from '../../util/TypeParser.js';
import RepaymentParty from '../state/repayment/RepaymentParty.js';
import state from '../state/State.js';

class TransactionManager {
  #users;
  #currentUserId;
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

  initializeTransactionsOnLoad(data) {
    const { transactionsData, users, currentUserId } = data;
    if (!Array.isArray(transactionsData)) {
      throw new Error(
        `Invalid transactions data: expected an array. Received: ${transactionsData} (type: ${typeof transactionsData})`
      );
    }
    if (transactionsData.length === 0) return [];

    this.#users = users;
    this.#currentUserId = currentUserId;

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
    expense.emoji = input.emoji;
    expense.title = input.title;

    // Demo date settings
    // expense.date = TypeParser.parseDate(input.date);
    expense.date = state.dates.today.date;

    return expense;
  }

  #initializeRepayment(input) {
    this.#validateTransactionInputFields(input, this.#requiredFieldsRepayment);
    const repayment = new Repayment();
    repayment.id = input.id;
    repayment.amount = input.amount;
    repayment.currentUserBalance = input.currentUserBalance;
    repayment.emoji = input.emoji;
    repayment.payer = this.#initializeRepaymentParty(input.payerId);
    repayment.recipient = this.#initializeRepaymentParty(input.recipientId);

    // Demo date settings
    // repayment.date = TypeParser.parseDate(input.date);
    repayment.date = state.dates.today.date;

    return repayment;
  }

  #initializeRepaymentParty(userId) {
    const partyId = TypeParser.parseId(userId);
    const isCurrentUser = partyId === this.#currentUserId ? true : false;
    const name = this.#users.get(partyId)?.name || null;
    if (!name) {
      throw new Error(`User not found for ID: ${partyId} (${typeof partyId})`);
    }
    return new RepaymentParty(partyId, name, isCurrentUser);
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
