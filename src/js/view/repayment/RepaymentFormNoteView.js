import { debounce } from '../util/InputHelper.js';
import { renderResetButton } from '../util/RenderHelper.js';

class RepaymentFormNoteView {
  #form;
  #input;
  #counter;
  #buttonClose;
  #resetBtn;

  constructor() {
    this.#form = document.querySelector('.add-repayment__form_note');
    this.#input = document.querySelector(
      '.add-transaction__form_input-note#repayment-note'
    );
    this.#counter = document.querySelector('.character-count.repayment-note');
    this.#buttonClose = this.#form.querySelector(
      '.add-repayment__form_btn-close'
    );
    this.#resetBtn = document.querySelector(
      '.repayment-hidden.reset-repayment-note'
    );
  }

  // GET

  get form() {
    return this.#form;
  }

  get counter() {
    return this.#counter;
  }

  // ADD HANDLERS

  addHandlerNoteInput = handler => {
    this.#input.addEventListener('input', debounce(handler, 300));
  };

  addHandlerNoteInputCount = handler => {
    this.#input.addEventListener('input', handler);
  };

  addHandlerButtonCloseClick = handler => {
    this.#buttonClose.addEventListener('click', handler);
  };

  addHandlerReset = handler => {
    this.#resetBtn.addEventListener('click', handler);
  };

  // RENDER

  render = (note, count) => {
    if (!note) {
      this.clear();
    } else {
      this.#input.value = note;
      this.renderCount(count);
    }
  };

  clear = () => {
    this.#input.value = '';
    this.renderCount(0);
  };

  renderCount = count => {
    this.#counter.textContent = count;
  };

  renderNoteInputResponse = ({ count, shouldClear }) => {
    if (shouldClear) {
      this.clear();
    } else {
      this.renderCount(count);
    }
  };

  renderResetButtonVisibility = isVisible => {
    renderResetButton(this.#resetBtn, isVisible);
  };
}

export default new RepaymentFormNoteView();
