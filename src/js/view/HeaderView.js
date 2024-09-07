import {
  ACTIVE_CLASS,
  IMAGES_PATH,
  DEFAULT_AVATAR,
  HIDDEN_ATTRIBUTE,
} from '../util/Config.js';

class HeaderView {
  #header;
  #menuAccount;
  #openMenuPopupBtn;
  #closeMenuPopupBtn;
  #menuPopup;

  constructor() {
    this.#header = document.querySelector('header');
    if (!this.#header) throw new Error('Header element not found');

    this.#menuAccount = document.querySelector('.menu__account');
    this.#openMenuPopupBtn = document.querySelector('.menu__btn--open');
    this.#closeMenuPopupBtn = document.querySelector('.menu__btn--close');
    this.#menuPopup = document.querySelector('.menu__popup');

    if (
      !this.#menuAccount ||
      !this.#openMenuPopupBtn ||
      !this.#closeMenuPopupBtn ||
      !this.#menuPopup
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
    const avatarUrl = avatar
      ? `${IMAGES_PATH}${avatar}`
      : `${IMAGES_PATH}${DEFAULT_AVATAR}`;

    this.#header
      .querySelectorAll('.account__avatar')
      ?.forEach(avatarElement => {
        avatarElement.src = avatarUrl;
        avatarElement.alt = username;
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
