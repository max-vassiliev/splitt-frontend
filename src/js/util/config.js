// Paths (Temporary)
export const DATA_PATH = '../../json/json/';
export const PAGE_LOAD_DATA = DATA_PATH + 'page-load-data.json';
// export const PAGE_LOAD_DATA = DATA_PATH + 'page-load-data-test.json';

// Global Constants
export const ACTIVE_CLASS = 'active';
export const INACTIVE_CLASS = 'inactive';
export const HIDDEN_CLASS = 'hidden';
export const INVISIBLE_CLASS = 'invisible';
export const DEFAULT_CLASS = 'default';
export const DISABLED_ATTRIBUTE = 'disabled';
export const HIDDEN_ATTRIBUTE = 'hidden';
export const BELOW_EXPENSE_AMOUNT_CLASS = 'below-expense-amount';
export const ABOVE_EXPENSE_AMOUNT_CLASS = 'above-expense-amount';
export const POSITIVE_CLASS = 'positive';
export const NEGATIVE_CLASS = 'negative';
export const DEFAULT_CURRENCY_SYMBOL = '₽';
export const DEFAULT_LOCALE = 'ru-RU';

// Images
export const IMAGES_PATH = '../../images/';
export const DEFAULT_AVATAR = `avatar-empty.png`;
export const DEFAULT_EMOJI_EXPENSE = '🗒️';
export const DEFAULT_EMOJI_REPAYMENT = '✅';

// Status
export const STATUS_POSITIVE = 'positive';
export const STATUS_NEGATIVE = 'negative';
export const STATUS_NEUTRAL = 'neutral';
export const STATUS_OPTIONS = new Set([
  STATUS_POSITIVE,
  STATUS_NEGATIVE,
  STATUS_NEUTRAL,
]);

// Styles
export const AMOUNT_COLOR_POSITIVE = 'amount__color--positive';
export const AMOUNT_COLOR_NEGATIVE = 'amount__color--negative';
export const AMOUNT_COLOR_NEUTRAL = 'amount__color--neutral';

// Transactions
export const TRANSACTION_TYPES = new Set(['expense', 'repayment']);
