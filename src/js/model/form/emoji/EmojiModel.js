import emojiManager from './EmojiManager.js';
import repaymentManager from '../repayment/RepaymentManager.js';
import expenseManager from '../expense/ExpenseManager.js';
import {
  TYPE_REPAYMENT,
  TYPE_EXPENSE,
  TRANSACTION_TYPES,
} from '../../../util/Config.js';

class EmojiModel {
  #formManagers;

  constructor() {
    this.#formManagers = new Map();
    this.#formManagers.set(TYPE_REPAYMENT, repaymentManager);
    this.#formManagers.set(TYPE_EXPENSE, expenseManager);
  }

  /**
   * Retrieves the currently active emoji field ID.
   * @returns {string|null} One of {@link TRANSACTION_TYPES} or null if no emoji field is active.
   */
  getActiveEmojiFieldId = () => {
    return emojiManager.getActiveEmojiFieldId();
  };

  /**
   * Saves the emoji in the currently active transaction form.
   * @param {string} emoji The emoji string.
   */
  saveEmoji = emoji => {
    const activeEmojiFieldId = emojiManager.getActiveEmojiFieldId();
    const formManager = this.#formManagers.get(activeEmojiFieldId);
    formManager.updateEmoji(emoji);
  };

  /**
   * Clears the active emoji field ID.
   */
  clearActiveEmojiFieldId = () => {
    emojiManager.clearActiveEmojiFieldId();
  };
}

export default new EmojiModel();
