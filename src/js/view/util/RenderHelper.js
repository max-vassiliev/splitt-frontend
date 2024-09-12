import {
  IMAGES_PATH,
  DEFAULT_AVATAR,
  AMOUNT_COLOR_POSITIVE,
  AMOUNT_COLOR_NEGATIVE,
  AMOUNT_COLOR_NEUTRAL,
  DEFAULT_CURRENCY_SYMBOL,
  DEFAULT_LOCALE,
} from '../../util/Config.js';

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

export const formatPercentForOutput = function (value) {
  if (value == null || !Number.isInteger(value)) return;
  return `${value}\u202F%`;
};

export const getAvatarUrl = function (avatar) {
  return avatar ? `${IMAGES_PATH}${avatar}` : `${IMAGES_PATH}${DEFAULT_AVATAR}`;
};

export const getAmountColor = function (amount) {
  if (!amount || amount === 0) return AMOUNT_COLOR_NEUTRAL;
  return amount < 0 ? AMOUNT_COLOR_NEGATIVE : AMOUNT_COLOR_POSITIVE;
};
