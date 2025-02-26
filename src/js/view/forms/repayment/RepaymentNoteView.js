import TransactionNoteView from '../common/TransactionNoteView';

class RepaymentNoteView extends TransactionNoteView {
  constructor() {
    super({
      form: '.add-repayment__form_note',
      input: '.add-transaction__form_input-note#repayment-note',
      counter: '.character-count.repayment-note',
      buttonClose: '.add-repayment__note-form_btn-close',
      resetBtn: '.repayment-hidden.reset-repayment-note',
    });
  }
}

export default new RepaymentNoteView();
