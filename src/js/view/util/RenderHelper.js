import {
  IMAGES_PATH,
  DEFAULT_AVATAR,
  AMOUNT_COLOR_POSITIVE,
  AMOUNT_COLOR_NEGATIVE,
  AMOUNT_COLOR_NEUTRAL,
  DEFAULT_CURRENCY_SYMBOL,
  DEFAULT_LOCALE,
} from '../../util/Config.js';

/**
 * Formats an amount in the smallest currency unit to a localized string with currency symbol.
 *
 * @param {number} amount - The amount in the smallest currency unit (e.g., cents for USD).
 * @param {Object} options - Formatting options.
 * @param {string} [options.locale=DEFAULT_LOCALE] - The locale for formatting.
 * @param {string} [options.currencySymbol=DEFAULT_CURRENCY_SYMBOL] - The currency symbol to use.
 * @param {boolean} [options.showSign=false] - Whether to show a sign (+ or -) before the amount.
 * @returns {string|undefined} The formatted amount string or undefined if the amount is invalid.
 */
export const formatAmountForOutput = function (
  amount,
  {
    locale = DEFAULT_LOCALE,
    currencySymbol = DEFAULT_CURRENCY_SYMBOL,
    showSign = false,
  } = {}
) {
  if (amount == null || !Number.isInteger(amount)) return;

  let formattedAmount = Math.abs(amount / 100).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  let sign = '';
  if (showSign) {
    if (amount < 0) {
      sign = '-\u00A0';
    } else if (amount > 0) {
      sign = '+\u00A0';
    }
  }

  return `${sign}${formattedAmount}\u00A0${currencySymbol}`;
};

/**
 * Formats a percentage value as a string with a percentage symbol.
 *
 * @param {number} value - The percentage value.
 * @returns {string|undefined} The formatted percentage string or undefined if the value is invalid.
 */
export const formatPercentForOutput = function (value) {
  if (value == null || !Number.isInteger(value)) return;
  return `${value}\u202F%`;
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
