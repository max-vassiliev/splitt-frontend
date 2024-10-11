import { ACTIVE_CLASS, DISABLED_ATTRIBUTE } from '../../util/Config.js';
import { getAvatarUrl } from '../util/RenderHelper.js';

class GroupModalView {
  #groupModal;
  #groupModalCloseBtn;
  #groupSwitch;
  #groupSwitchBtn;

  constructor() {
    this.#groupModal = document.querySelector('.group__modal');
    this.#groupSwitch = document.querySelector('.group__switch');
    this.#groupSwitchBtn = document.querySelector('.group__switch_btn');
    this.#groupModalCloseBtn = document.querySelector('.group__btn-close');
  }

  render({ id, title, avatar }) {
    this.#groupModal.querySelector('.group__img').src = getAvatarUrl(avatar);
    this.#groupModal.querySelector('.group__title').textContent = title;
    const switchOptionHTML = this.#generateSwitchOptionHTML({ id, title });
    this.#groupSwitch.insertAdjacentHTML('afterbegin', switchOptionHTML);
  }

  renderSwitchOptions(options) {
    this.#validateSwitchOptions(options);
    const optionsHTML = this.#generateOptionsHTML(options);
    this.#groupSwitch.insertAdjacentHTML('beforeend', optionsHTML);
  }

  getGroupModal() {
    return this.#groupModal;
  }

  activateGroupSwitchBtn() {
    this.#groupSwitchBtn.classList.add(ACTIVE_CLASS);
    this.#groupSwitchBtn.removeAttribute(DISABLED_ATTRIBUTE);
  }

  deactivateGroupSwitchBtn() {
    if (!this.#groupSwitchBtn.classList.contains(ACTIVE_CLASS)) return;
    this.#groupSwitchBtn.classList.remove(ACTIVE_CLASS);
    this.#groupSwitchBtn.setAttribute(DISABLED_ATTRIBUTE, DISABLED_ATTRIBUTE);
  }

  /**
   * Add Handlers
   */

  addHandlerGroupModalCloseBtnClick(handler) {
    this.#groupModalCloseBtn.addEventListener('click', handler);
  }

  addHandlerGroupSwitchChange(handler) {
    this.#groupSwitch.addEventListener('change', handler);
  }

  /**
   * Generate HTML
   */

  #generateSwitchOptionHTML({ id, title }) {
    return `<option value="${id.toString()}">${title}</option>`;
  }

  #generateOptionsHTML(options) {
    let optionsHTML = '';

    options.forEach(option => {
      const newHTML = this.#generateSwitchOptionHTML({
        id: option.id,
        title: option.title,
      });
      optionsHTML += newHTML;
    });

    return optionsHTML;
  }

  /**
   * Validation
   */

  #validateSwitchOptions(options) {
    if (!Array.isArray(options) || options.length === 0) {
      throw new Error(
        `Invalid group options. Expected an non-empty array. Received: ${JSON.stringify(
          options
        )} (${typeof options})`
      );
    }
  }
}

export default new GroupModalView();
