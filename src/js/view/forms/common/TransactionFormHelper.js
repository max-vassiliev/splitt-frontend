import { ACTIVE_CLASS, DISABLED_ATTRIBUTE } from '../../../util/Config.js';
import {
  formatAmountForOutput,
  setAmountCursorPosition,
} from '../../util/RenderHelper.js';

class TransactionFormHelper {
  renderAmountInput = ({
    processedAmount,
    amountIn,
    cursorPosition,
    inputElement,
  }) => {
    const amountOut = formatAmountForOutput(processedAmount);
    inputElement.value = amountOut;
    if (!cursorPosition) return;
    setAmountCursorPosition({
      amountIn,
      amountOut,
      cursorPosition,
      inputElement,
    });
  };

  updateDateInput = ({ min, max, updateDefaultDate, dateInput }) => {
    dateInput.setAttribute('max', max);
    dateInput.setAttribute('min', min);
    if (updateDefaultDate) dateInput.value = max;
  };

  renderSubmitButton = (submitButton, isFormValid) => {
    if (isFormValid) {
      submitButton.removeAttribute(DISABLED_ATTRIBUTE);
      submitButton.classList.add(ACTIVE_CLASS);
    } else {
      submitButton.setAttribute(DISABLED_ATTRIBUTE, DISABLED_ATTRIBUTE);
      submitButton.classList.remove(ACTIVE_CLASS);
    }
  };
}

export default new TransactionFormHelper();
