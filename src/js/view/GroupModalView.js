import { ACTIVE_CLASS, DISABLED_ATTRIBUTE } from '../util/Config.js';
import { getAvatarUrl } from './util/RenderHelper.js';

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

  addHandlerGroupModalCloseBtnClick(handler) {
    this.#groupModalCloseBtn.addEventListener('click', handler);
  }

  addHandlerGroupSwitchChange(handler) {
    this.#groupSwitch.addEventListener('change', handler);
  }

  renderHeader({ title, avatar }) {
    this.#groupModal.querySelector('.group__img').src = getAvatarUrl(avatar);
    this.#groupModal.querySelector('.group__title').textContent = title;
  }
}

export default new GroupModalView();
