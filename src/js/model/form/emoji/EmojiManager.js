import state from '../../state/State.js';
import { TRANSACTION_TYPES } from '../../../util/Config.js';

class EmojiManager {
  /**
   * Retrieves the currently active emoji field ID.
   * @returns {string|null} One of {@link TRANSACTION_TYPES} or null, if not assigned.
   */
  getActiveEmojiFieldId = () => {
    return state.activeEmojiFieldId;
  };

  /**
   * Sets the active emoji field based on the transaction type.
   * @param {string} transactionType One of the values from {@link TRANSACTION_TYPES}.
   */
  setActiveEmojiFieldId = transactionType => {
    state.activeEmojiFieldId = transactionType;
  };

  /**
   * Clears the active emoji field ID, setting it to null.
   */
  clearActiveEmojiFieldId = () => {
    state.activeEmojiFieldId = null;
  };
}

export default new EmojiManager();
