import TransactionNoteView from '../../../common/TransactionNoteView';

class ExpenseNoteView extends TransactionNoteView {
  constructor() {
    super({
      form: '.add-expense__form_note',
      input: '.add-transaction__form_input-note#expense-note',
      counter: '.character-count.expense-note',
      buttonClose: '.add-expense__note-form_btn-close',
      resetBtn: '.repayment-hidden.reset-repayment-note', // TODO! поменять на expense
    });
  }
}

export default new ExpenseNoteView();
