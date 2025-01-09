// App Config
export const USE_MOCKS = true;
// export const USE_MOCKS = false;

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

// Modals
export const MODAL_ID_MENU = 1;
export const MODAL_ID_GROUP = 2;
export const MODAL_ID_REPAYMENT = 3;
export const MODAL_IDS = new Set([
  MODAL_ID_MENU,
  MODAL_ID_GROUP,
  MODAL_ID_REPAYMENT,
]);

// Modal Events
export const MODAL_CLOSE_REPAYMENT = 'repaymentFormClosed';

// Numbers
export const MIN_TRANSACTION_YEAR_LIMIT = 5;
export const MAX_AMOUNT = 10000000000;
export const DEFAULT_AMOUNT = 0;
export const ONE_HUNDRED_PERCENT = 100;

// Images
export const IMAGES_PATH = '../../images/';
export const DEFAULT_AVATAR = `avatar-empty.png`;
export const DEFAULT_EMOJI_EXPENSE = '🗒️';
export const DEFAULT_EMOJI_REPAYMENT = '✅';
export const DEFAULT_EMOJI_EMPTY = 'no_emoji';

// Status
export const STATUS_POSITIVE = 'positive';
export const STATUS_NEGATIVE = 'negative';
export const STATUS_NEUTRAL = 'neutral';
export const STATUS_OPTIONS = new Set([
  STATUS_POSITIVE,
  STATUS_NEGATIVE,
  STATUS_NEUTRAL,
]);

// Status
export const VALIDATION_STATUS_NO_EDIT = 'noedit';
export const VALIDATION_STATUS_VALID = 'valid';
export const VALIDATION_STATUS_INVALID = 'invalid';

// Styles
export const AMOUNT_COLOR_POSITIVE = 'amount__color--positive';
export const AMOUNT_COLOR_NEGATIVE = 'amount__color--negative';
export const AMOUNT_COLOR_NEUTRAL = 'amount__color--neutral';

// Transactions
export const TYPE_EXPENSE = 'expense';
export const TYPE_REPAYMENT = 'repayment';
export const TRANSACTION_TYPES = new Set([TYPE_EXPENSE, TYPE_REPAYMENT]);
export const TRANSACTION_NOTE_LIMIT = 250;

// Repayment
export const REPAYMENT_FORM_ADD = 'add';
export const REPAYMENT_FORM_SETTLE = 'settle';
export const REPAYMENT_FORM_EDIT = 'edit';
export const REPAYMENT_FORM_TYPES = new Set([
  REPAYMENT_FORM_ADD,
  REPAYMENT_FORM_SETTLE,
  REPAYMENT_FORM_EDIT,
]);
export const REPAYMENT_HIDDEN_FORM_NOTE = 'note';
export const REPAYMENT_HIDDEN_FORM_TYPES = new Set([
  REPAYMENT_HIDDEN_FORM_NOTE,
]);
