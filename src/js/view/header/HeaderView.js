import { ACTIVE_CLASS, HIDDEN_ATTRIBUTE } from '../../util/Config.js';
import { getAvatarUrl } from '../util/RenderHelper.js';

class HeaderView {
  #header;
  #menuAccount;
  #openMenuPopupBtn;
  #closeMenuPopupBtn;
  #groupSettingsLink;
  #menuPopup;

  constructor() {
    this.#header = document.querySelector('header');
    if (!this.#header) throw new Error('Header element not found');

    this.#menuAccount = document.querySelector('.menu__account');
    this.#openMenuPopupBtn = document.querySelector('.menu__btn--open');
    this.#closeMenuPopupBtn = document.querySelector('.menu__btn--close');
    this.#menuPopup = document.querySelector('.menu__popup');
    this.#groupSettingsLink = document.querySelector('.link__group--settings');

    if (
      !this.#menuAccount ||
      !this.#openMenuPopupBtn ||
      !this.#closeMenuPopupBtn ||
      !this.#menuPopup ||
      !this.#groupSettingsLink
    ) {
      throw new Error('Some required elements were not found in the header');
    }
  }

  get menuPopup() {
    return this.#menuPopup;
  }

  get openMenuPopupBtn() {
    return this.#openMenuPopupBtn;
  }

  get menuAccount() {
    return this.#menuAccount;
  }

  addHandlerOpenMenuPopup(handler) {
    this.#openMenuPopupBtn.addEventListener('click', handler);
    this.#menuAccount.addEventListener('click', handler);
  }

  addHandlerCloseMenuPopup(handler) {
    this.#closeMenuPopupBtn.addEventListener('click', handler);
  }

  addHandlerClickOutsideMenuPopup(handler) {
    document.addEventListener('click', handler);
  }

  addHandlerClickGroupSettings(handler) {
    this.#groupSettingsLink.addEventListener('click', handler);
  }

  removeHandlerClickOutsideMenuPopup(handler) {
    document.removeEventListener('click', handler);
  }

  openMenuPopup() {
    this.#menuPopup.classList.add(ACTIVE_CLASS);
  }

  closeMenuPopup() {
    this.#menuPopup.classList.remove(ACTIVE_CLASS);
  }

  renderHeader({ username, avatar }) {
    this.#header
      .querySelectorAll('.account__avatar')
      ?.forEach(avatarElement => {
        avatarElement.src = getAvatarUrl(avatar);
      });

    this.#header
      .querySelectorAll('.account__username')
      ?.forEach(usernameElement => {
        usernameElement.textContent = username;
      });

    this.#header.removeAttribute(HIDDEN_ATTRIBUTE);
  }
}

export default new HeaderView();
