import { debounce } from '../../util/InputHelper.js';
import { renderResetButton } from '../../util/RenderHelper.js';

class TransactionNoteView {
  _form;
  _input;
  _counter;
  _buttonClose;
  _resetBtn;

  constructor(elements) {
    this.#initElements(elements);
  }

  #initElements = elements => {
    const { form, input, counter, buttonClose, resetBtn } = elements;
    this._form = document.querySelector(form);
    this._input = document.querySelector(input);
    this._counter = document.querySelector(counter);
    this._buttonClose = document.querySelector(buttonClose);
    this._resetBtn = document.querySelector(resetBtn);
  };

  // GET

  get form() {
    return this._form;
  }

  get counter() {
    return this._counter;
  }

  // ADD HANDLERS

  addHandlerNoteInput = handler => {
    this._input.addEventListener('input', debounce(handler, 300));
  };

  addHandlerNoteInputCount = handler => {
    this._input.addEventListener('input', handler);
  };

  addHandlerButtonCloseClick = handler => {
    this._buttonClose.addEventListener('click', handler);
  };

  addHandlerReset = handler => {
    this._resetBtn.addEventListener('click', handler);
  };

  // RENDER

  render = (note, count) => {
    if (!note) {
      this.clear();
    } else {
      this._input.value = note;
      this.renderCount(count);
    }
  };

  clear = () => {
    this._input.value = '';
    this.renderCount(0);
  };

  renderCount = count => {
    this._counter.textContent = count;
  };

  renderNoteInputResponse = ({ count, shouldClear }) => {
    if (shouldClear) {
      this.clear();
    } else {
      this.renderCount(count);
    }
  };

  renderResetButtonVisibility = isVisible => {
    renderResetButton(this._resetBtn, isVisible);
  };
}

export default TransactionNoteView;
