import { ACTIVE_CLASS } from '../../util/Config.js';
import { isActive, isNonEmptyString } from '../../util/SplittValidator.js';

class EmojiPickerView {
  #container;
  #pickerElement;
  #emojiPicker;

  constructor() {
    this.#container = document.querySelector('.emoji-picker-container');
    this.#pickerElement = document.getElementById('emoji-picker');
  }

  // Handlers

  initEmojiPicker = emojiSelectHandler => {
    const emojiPickerOptions = {
      onEmojiSelect: emojiSelectHandler,
      searchPosition: 'static',
      previewPosition: 'none',
      locale: 'ru',
    };
    this.#emojiPicker = new EmojiMart.Picker(emojiPickerOptions);
    this.#pickerElement?.appendChild(this.#emojiPicker);
  };

  addHandlerClickOutsideEmojiPicker = handler => {
    document.addEventListener('click', handler);
  };

  removeHandlerClickOutsideEmojiPicker = handler => {
    document.removeEventListener('click', handler);
  };

  // Getters

  get container() {
    return this.#container;
  }

  isEmojiPickerActive = () => {
    return isActive(this.#container);
  };

  activate = () => {
    this.#container.classList.add(ACTIVE_CLASS);
  };

  deactivate = () => {
    this.#container.classList.remove(ACTIVE_CLASS);
  };

  isClickOutside = event => {
    return !this.#container.contains(event.target);
  };

  /**
   * Sets the emoji container's top margin.
   * @param {string} value The margin in pixels.
   * @throws {Error} If the value is not a non-empty string.
   */
  setTopMargin = value => {
    if (!isNonEmptyString(value)) {
      throw new Error(
        `Invalid value for top margin: expected a non-empty string. Received: ${value} (type: ${typeof value}).`
      );
    }
    this.#container.style.top = value;
  };
}

export default new EmojiPickerView();
