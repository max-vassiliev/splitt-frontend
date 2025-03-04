import pickerView from '../../../view/emoji/EmojiPickerView.js';
import fieldView from '../../../view/emoji/EmojiFieldView.js';
import model from '../../../model/form/emoji/EmojiModel.js';
import { DEFAULT_EMOJI_EMPTY } from '../../../util/Config.js';

class EmojiController {
  init() {
    pickerView.initEmojiPicker(this.#handleEmojiSelect);
  }

  registerEmojiField = emojiFieldData => {
    fieldView.registerEmojiField(emojiFieldData);
  };

  // Toggle

  toggleEmojiPicker = () => {
    !pickerView.isEmojiPickerActive()
      ? this.openEmojiPicker()
      : this.closeEmojiPicker();
  };

  openEmojiPicker = () => {
    if (pickerView.isEmojiPickerActive()) {
      return;
    }
    pickerView.activate();
    pickerView.addHandlerClickOutsideEmojiPicker(
      this.#handleClickOutsideEmojiPicker
    );
  };

  closeEmojiPicker = () => {
    if (!pickerView.isEmojiPickerActive()) return;
    pickerView.deactivate();
    pickerView.removeHandlerClickOutsideEmojiPicker(
      this.#handleClickOutsideEmojiPicker
    );
  };

  // Handlers (public)

  restoreDefaultEmoji = defaultEmoji => {
    const activeFieldId = model.getActiveEmojiFieldId();
    fieldView.selectEmoji(activeFieldId, defaultEmoji);
    model.saveEmoji(defaultEmoji);
  };

  handleEmojiRemove = () => {
    const activeFieldId = model.getActiveEmojiFieldId();
    fieldView.removeEmoji(activeFieldId);
    model.saveEmoji(DEFAULT_EMOJI_EMPTY);
  };

  // Handlers (private)

  #handleEmojiSelect = emoji => {
    const activeEmojiFieldId = model.getActiveEmojiFieldId();
    fieldView.selectEmoji(activeEmojiFieldId, emoji.native);
    model.saveEmoji(emoji.native);
    this.closeEmojiPicker();
  };

  #handleClickOutsideEmojiPicker = event => {
    if (!pickerView.isClickOutside(event)) return;
    this.closeEmojiPicker();
  };

  // Alignment

  alignContainer = () => {
    const activeEmojiFieldId = model.getActiveEmojiFieldId();
    if (!activeEmojiFieldId) return;
    const topMargin = fieldView.getTopMargin(activeEmojiFieldId);
    if (!topMargin) return;
    pickerView.setTopMargin(topMargin);
  };

  setFieldTopMargin = ({ fieldId, topMargin }) => {
    fieldView.setTopMargin(fieldId, topMargin);
  };
}

export default new EmojiController();
