// App Config
export const USE_MOCKS = true;
// export const USE_MOCKS = false;

// Global Constants
export const ACTIVE_CLASS = 'active';
export const INACTIVE_CLASS = 'inactive';
export const HIDDEN_CLASS = 'hidden';
export const VISIBLE_CLASS = 'visible';
export const INVISIBLE_CLASS = 'invisible';
export const DEFAULT_CLASS = 'default';
export const DISABLED_ATTRIBUTE = 'disabled';
export const SELECTED_ATTRIBUTE = 'selected';
export const HIDDEN_ATTRIBUTE = 'hidden';
export const READONLY_ATTRIBUTE = 'readonly';
export const BELOW_EXPENSE_AMOUNT_CLASS = 'below-expense-amount';
export const ABOVE_EXPENSE_AMOUNT_CLASS = 'above-expense-amount';
export const POSITIVE_CLASS = 'positive';
export const NEGATIVE_CLASS = 'negative';
export const DEFAULT_CURRENCY_SYMBOL = '₽';
export const DEFAULT_LOCALE = 'ru-RU';

// Modals
export const MODAL_ID_MENU = 1;
export const MODAL_ID_GROUP = 2;
export const MODAL_ID_EXPENSE = 3;
export const MODAL_ID_REPAYMENT = 4;
export const MODAL_IDS = new Set([
  MODAL_ID_MENU,
  MODAL_ID_GROUP,
  MODAL_ID_EXPENSE,
  MODAL_ID_REPAYMENT,
]);

// Numbers
export const MIN_TRANSACTION_YEAR_LIMIT = 5;
export const MAX_AMOUNT = 10000000000;
export const MIN_EXPENSE_AMOUNT = 100;
export const DEFAULT_AMOUNT = 0;
export const ONE_HUNDRED_PERCENT = 100;

// Images
export const IMAGES_PATH = '../../images/';
export const DEFAULT_AVATAR = `avatar-empty.png`;
export const DEFAULT_EMOJI_EXPENSE = '🗒️';
export const DEFAULT_EMOJI_REPAYMENT = '✅';
export const DEFAULT_EMOJI_EMPTY = 'no_emoji';

// Misc

export const USERNAME_OTHER = 'другой пользователь';

// Status
export const STATUS_POSITIVE = 'positive';
export const STATUS_NEGATIVE = 'negative';
export const STATUS_NEUTRAL = 'neutral';
export const STATUS_OPTIONS = new Set([
  STATUS_POSITIVE,
  STATUS_NEGATIVE,
  STATUS_NEUTRAL,
]);

// Form Validation Status
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
export const TRANSACTION_TITLE_LIMIT = 50;

// Expense
export const EXPENSE_FORM_ADD = 'exp-add';
export const EXPENSE_FORM_EDIT = 'exp-edit';
export const EXPENSE_FORM_TYPES = new Set([
  EXPENSE_FORM_ADD,
  EXPENSE_FORM_EDIT,
]);
export const EXPENSE_HIDDEN_FORM_PAID_BY = 'exp-paid-by';
export const EXPENSE_HIDDEN_FORM_SPLITT = 'exp-splitt';
export const EXPENSE_HIDDEN_FORM_NOTE = 'exp-note';
export const EXPENSE_HIDDEN_FORM_TYPES = new Set([
  EXPENSE_HIDDEN_FORM_PAID_BY,
  EXPENSE_HIDDEN_FORM_SPLITT,
  EXPENSE_HIDDEN_FORM_NOTE,
]);
export const EVENT_EXPENSE_EMOJI_EDIT = 'repaymentFormEmojiEdited';

// Expense: Paid By
export const EXPENSE_PAID_BY_EMPTY = 'exp-paid-by__empty';
export const EXPENSE_PAID_BY_CURRENT_USER = 'exp-paid-by__current-user';
export const EXPENSE_PAID_BY_OTHER_USER = 'exp-paid-by__other-user';
export const EXPENSE_PAID_BY_COPAYMENT = 'exp-paid-by__copayment';
export const EXPENSE_PAID_BY_TYPES = new Set([
  EXPENSE_PAID_BY_EMPTY,
  EXPENSE_PAID_BY_CURRENT_USER,
  EXPENSE_PAID_BY_OTHER_USER,
  EXPENSE_PAID_BY_COPAYMENT,
]);
export const EXPENSE_PAID_BY_OPTION_EMPTY_ID = 0n;

// Expense: Splitt
export const EXPENSE_SPLITT_EQUALLY = 'exp-splitt__equally';
export const EXPENSE_SPLITT_PARTS = 'exp-splitt__parts';
export const EXPENSE_SPLITT_SHARES = 'exp-splitt__shares';
export const EXPENSE_SPLITT_TYPES = new Set([
  EXPENSE_SPLITT_EQUALLY,
  EXPENSE_SPLITT_PARTS,
  EXPENSE_SPLITT_SHARES,
]);
export const EXPENSE_BALANCE_DEFAULT = 'exp-balance__default';
export const EXPENSE_BALANCE_CHECK_PAID_BY = 'exp-balance__check-paid-by';
export const EXPENSE_BALANCE_CHECK_SPLITT = 'exp-balance__check-splitt';
export const EXPENSE_BALANCE_AMOUNT_BELOW_MIN = 'exp-balance__below-min';
export const EXPENSE_BALANCE_AMOUNT_ZERO = 'exp-balance__zero';
export const EXPENSE_BALANCE_STATUSES = new Set([
  EXPENSE_BALANCE_DEFAULT,
  EXPENSE_BALANCE_CHECK_PAID_BY,
  EXPENSE_BALANCE_CHECK_SPLITT,
  EXPENSE_BALANCE_AMOUNT_BELOW_MIN,
  EXPENSE_BALANCE_AMOUNT_ZERO,
]);

// Repayment
export const REPAYMENT_FORM_ADD = 'rpm-add';
export const REPAYMENT_FORM_SETTLE = 'rpm-settle';
export const REPAYMENT_FORM_EDIT = 'rpm-edit';
export const REPAYMENT_FORM_TYPES = new Set([
  REPAYMENT_FORM_ADD,
  REPAYMENT_FORM_SETTLE,
  REPAYMENT_FORM_EDIT,
]);
export const REPAYMENT_HIDDEN_FORM_NOTE = 'rpm-note';
export const REPAYMENT_HIDDEN_FORM_TYPES = new Set([
  REPAYMENT_HIDDEN_FORM_NOTE,
]);
export const EVENT_REPAYMENT_EMOJI_EDIT = 'repaymentFormEmojiEdited';

// Transaction Forms
export const TRANSACTION_FORM_TYPES = new Set([
  ...EXPENSE_FORM_TYPES,
  ...REPAYMENT_FORM_TYPES,
]);
