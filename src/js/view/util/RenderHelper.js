import {
  ACTIVE_CLASS,
  HIDDEN_CLASS,
  VISIBLE_CLASS,
  INVISIBLE_CLASS,
  IMAGES_PATH,
  DEFAULT_AVATAR,
  DEFAULT_AMOUNT,
  AMOUNT_COLOR_POSITIVE,
  AMOUNT_COLOR_NEGATIVE,
  AMOUNT_COLOR_NEUTRAL,
  ABOVE_EXPENSE_AMOUNT_CLASS,
  BELOW_EXPENSE_AMOUNT_CLASS,
  MIN_EXPENSE_AMOUNT,
} from '../../util/Config.js';

import appSettings from '../../util/AppSettings.js';

/**
 * Adds the 'active' class to an HTML element.
 * @param {HTMLElement} element The HTML element.
 * @see {@link ACTIVE_CLASS}
 */
export const activateHTMLElement = element => {
  if (!(element instanceof HTMLElement)) return;
  element.classList.add(ACTIVE_CLASS);
};

/**
 * Checks if an HTML element contains the 'active' class.
 * @param {HTMLElement} element The HTML element.
 * @returns {boolean} 'True' if the element contains the 'active' class, otherwise 'false'.
 * @see {@link ACTIVE_CLASS}
 */
export const isActiveHTMLElement = element => {
  if (!(element instanceof HTMLElement)) return;
  return element.classList.contains(ACTIVE_CLASS);
};

/**
 * Removes the 'active' class from an HTML element.
 * @param {HTMLElement} element The HTML element.
 * @see {@link ACTIVE_CLASS}
 */
export const deactivateHTMLElement = element => {
  if (!(element instanceof HTMLElement)) return;
  element.classList.remove(ACTIVE_CLASS);
};

/**
 * Removes a utility class from an HTML element.
 *
 * @param {HTMLElement} element - The element from which utility class should be removed.
 * @param {string} utilityClass - The utility class name to be removed.
 */
export const removeUtilityClass = (element, utilityClass) => {
  element.classList.remove(utilityClass);
};

/**
 * Removes utility classes from an HTML element.
 *
 * @param {HTMLElement} element - The element from which utility classes should be removed.
 * @param {string[]} utilityClasses - An array of utility class names to be removed.
 */
export const removeUtilityClasses = (element, utilityClasses) => {
  utilityClasses.forEach(utilityClass => {
    removeUtilityClass(element, utilityClass);
  });
};

/**
 * Formats an amount in the smallest currency unit to a localized string with a currency symbol.
 *
 * @param {number} amount - The amount in the smallest currency unit (e.g., cents for USD). Defaults to [DEFAULT_AMOUNT]{@link DEFAULT_AMOUNT}.
 * @param {Object} [options={}] - Formatting options.
 * @param {boolean} [options.showSign=false] - Whether to show a sign (+ or -) before the amount.
 * @param {string} [options.locale=appSettings.locale] - The locale for formatting.
 * @param {string} [options.currencySymbol=appSettings.currencySymbol] - The currency symbol to use.
 * @returns {string} The formatted amount string or the default amount string if the amount is invalid.
 */
export const formatAmountForOutput = function (
  amount,
  { showSign = false, ...options } = {}
) {
  let amountToFormat;
  if (amount == null || !Number.isInteger(amount)) {
    amountToFormat = DEFAULT_AMOUNT;
  } else {
    amountToFormat = amount;
  }
  const locale = options.locale ?? appSettings.locale;
  const currencySymbol = options.currencySymbol ?? appSettings.currencySymbol;

  let formattedAmount = Math.abs(amountToFormat / 100).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  let sign = '';
  if (showSign) {
    if (amountToFormat < 0) {
      sign = '-\u00A0';
    } else if (amountToFormat > 0) {
      sign = '+\u00A0';
    }
  }

  return `${sign}${formattedAmount}\u00A0${currencySymbol}`;
};

/**
 * Formats a percentage value as a string with a percentage symbol.
 *
 * @param {number} value - The percentage value.
 * @returns {string} The formatted percentage string or default percentage string if the value is invalid.
 */
export const formatPercentForOutput = function (value) {
  let percentToFormat;
  if (value == null || !Number.isInteger(value)) {
    percentToFormat = DEFAULT_AMOUNT;
  } else {
    percentToFormat = value;
  }
  return `${percentToFormat}\u202F%`;
};

/**
 * Converts a Date object to a string in 'DD.MM.YYYY' format.
 * This format is used for displaying dates to the user.
 *
 * @param {Date} date - The Date object to format.
 * @returns {string} The formatted date string in 'DD.MM.YYYY' format.
 */
export const formatDateForDisplay = function (date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}.${month}.${year}`;
};

/**
 * Sets the cursor position in an input element based on the change in input value length.
 *
 * @param {Object} params - The parameters for setting the cursor position.
 * @param {string} params.amountIn - The original input amount before formatting.
 * @param {string} params.amountOut - The formatted output amount.
 * @param {number} params.cursorPosition - The original cursor position before formatting.
 * @param {HTMLInputElement} params.inputElement - The input element in which to set the cursor position.
 */
export const setAmountCursorPosition = function ({
  amountIn,
  amountOut,
  cursorPosition,
  inputElement,
}) {
  const lengthDifference = amountOut.length - amountIn.length;
  let newCursorPosition = cursorPosition + lengthDifference;
  newCursorPosition = Math.max(0, Math.min(amountIn.length, newCursorPosition));
  if (newCursorPosition >= amountOut.length - 1) {
    newCursorPosition = amountOut.length - 2;
  }
  inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
};

/**
 * Sets the cursor position in an input element if the user clicks near the currency sign.
 *
 * @param {Object} params - The parameters for setting the cursor position on click.
 * @param {string} params.inputValue - The current input value.
 * @param {HTMLInputElement} params.inputElement - The input element in which to set the cursor position.
 * @param {number} params.cursorPosition - The cursor position when the input element was clicked.
 */
export const setAmountCursorOnClick = ({
  inputValue,
  inputElement,
  cursorPosition,
}) => {
  if (cursorPosition < inputValue.length - 1) return;
  const newCursorPosition = inputValue.length - 5;
  inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
};

/**
 * Returns the full URL for an avatar image.
 *
 * @param {string} avatar - The avatar file name.
 * @returns {string} The full URL for the avatar image.
 */
export const getAvatarUrl = function (avatar) {
  return avatar ? `${IMAGES_PATH}${avatar}` : `${IMAGES_PATH}${DEFAULT_AVATAR}`;
};

/**
 * Determines the color associated with a monetary amount.
 *
 * @param {number} amount - The amount.
 * @returns {string} The color associated with the amount (positive, negative, or neutral).
 */
export const getAmountColor = function (amount) {
  if (!amount || amount === 0) return AMOUNT_COLOR_NEUTRAL;
  return amount < 0 ? AMOUNT_COLOR_NEGATIVE : AMOUNT_COLOR_POSITIVE;
};

/**
 * Updates the styling of the remainder row.
 *
 * @param {number} remainderAmount - The remainder amount. Must be an integer.
 * @param {number} expenseAmount - The total expense amount. Must be an integer.
 * @param {HTMLElement} row - The remainder row element.
 */
export const restyleRemainderRow = function (
  remainderAmount,
  expenseAmount,
  row
) {
  if (!Number.isInteger(remainderAmount) || !Number.isInteger(expenseAmount)) {
    return;
  }
  removeUtilityClasses(row, [
    ABOVE_EXPENSE_AMOUNT_CLASS,
    BELOW_EXPENSE_AMOUNT_CLASS,
  ]);

  if (remainderAmount === 0 || expenseAmount < MIN_EXPENSE_AMOUNT) {
    row.style.visibility = HIDDEN_CLASS;
    return;
  }

  row.style.visibility = VISIBLE_CLASS;
  const rowStyle =
    remainderAmount < 0
      ? ABOVE_EXPENSE_AMOUNT_CLASS
      : BELOW_EXPENSE_AMOUNT_CLASS;

  row.classList.add(rowStyle);
};

/**
 * Adjusts the width of one or more HTML elements based on the length of the largest amount.
 *
 * @param {Object} params - The parameters object.
 * @param {number} params.total - The total amount to compare.
 * @param {number} params.expenseAmount - The expense amount to compare.
 * @param {Map<number, string>} params.widthOptions - A map where the key is the number of digits
 * in the amount and the value is the corresponding width.
 * @param {string} params.defaultWidth - The default width to apply if no match is found in widthOptions.
 * @param {HTMLElement[] | HTMLElement} params.inputElements - A single HTML element or an array of elements to be resized.
 */
export const adjustAmountElementsWidth = ({
  total,
  expenseAmount,
  widthOptions,
  defaultWidth,
  amountElements,
}) => {
  const referenceAmount = expenseAmount > total ? expenseAmount : total;
  const referenceAmountLength = referenceAmount.toString().length;
  const adjustedWidth = widthOptions.get(referenceAmountLength) || defaultWidth;
  if (Array.isArray(amountElements)) {
    amountElements.forEach(amountElement => {
      amountElement.style.width = adjustedWidth;
    });
  } else if (amountElements instanceof HTMLElement) {
    amountElements.style.width = adjustedWidth;
  } else {
    console.warn('adjustAmountElementsWidth: Invalid amountElements provided.');
  }
};

/**
 * Toggles the visibility of a reset button based on the `isVisible` flag.
 *
 * @param {HTMLElement} button - The reset button element to be shown or hidden.
 * @param {boolean} isVisible - Determines the visibility of the button.
 *                              `true` makes the button visible, `false` hides it.
 */
export const renderResetButton = function (button, isVisible) {
  if (isVisible) {
    button.classList.remove(INVISIBLE_CLASS);
  } else {
    button.classList.add(INVISIBLE_CLASS);
  }
};

/**
 * Toggles the emoji input field for a particular form.
 *
 * Is shown when an emoji is assigned to the field.
 * Is hidden when an emoji is removed or no emoji is assigned.
 *
 * @param {Object} emojiField An object with HTMLElement instances related to the emoji input field.
 * @param {boolean} shouldShow The flag marking whether to show or hide the field.
 */
export const toggleEmojiInputField = (emojiField, shouldShow = true) => {
  if (shouldShow) {
    emojiField.inputField.classList.add(ACTIVE_CLASS);
    emojiField.removeBtn.classList.add(ACTIVE_CLASS);
    emojiField.defaultBtn.classList.add(HIDDEN_CLASS);
    emojiField.pickerSwitchBtn.classList.add(HIDDEN_CLASS);
  } else {
    emojiField.inputField.classList.remove(ACTIVE_CLASS);
    emojiField.removeBtn.classList.remove(ACTIVE_CLASS);
    emojiField.defaultBtn.classList.remove(HIDDEN_CLASS);
    emojiField.pickerSwitchBtn.classList.remove(HIDDEN_CLASS);
  }
};
