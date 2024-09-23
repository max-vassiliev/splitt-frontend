import userModel from '../../model/user/UserModel.js';
import headerView from '../view/HeaderView.js';
import { EventEmitter } from 'events';

class HeaderController extends EventEmitter {
  constructor() {
    super();
    this.handleClickOutsideMenuPopup =
      this.handleClickOutsideMenuPopup.bind(this);
    this.openMenuPopup = this.openMenuPopup.bind(this);
    this.closeMenuPopup = this.closeMenuPopup.bind(this);
    this.handleGroupSettingsLinkClick =
      this.handleGroupSettingsLinkClick.bind(this);
  }

  init() {
    this.#loadData();
    this.#bindEventHandlers();
  }

  #loadData() {
    const userData = userModel.getCurrentUserNameAndAvatar();
    headerView.renderHeader(userData);
  }

  #bindEventHandlers() {
    headerView.addHandlerOpenMenuPopup(this.openMenuPopup);
    headerView.addHandlerCloseMenuPopup(this.closeMenuPopup);
    headerView.addHandlerClickGroupSettings(this.handleGroupSettingsLinkClick);
  }

  openMenuPopup() {
    headerView.openMenuPopup();
    headerView.addHandlerClickOutsideMenuPopup(
      this.handleClickOutsideMenuPopup
    );
  }

  closeMenuPopup() {
    headerView.closeMenuPopup();
    headerView.removeHandlerClickOutsideMenuPopup(
      this.handleClickOutsideMenuPopup
    );
  }

  handleClickOutsideMenuPopup(event) {
    const isClickInsideMenuPopup = headerView.menuPopup.contains(event.target);
    const isClickOnOpenButton = headerView.openMenuPopupBtn.contains(
      event.target
    );
    const isClickOnMenuAccount = headerView.menuAccount.contains(event.target);

    if (
      !isClickInsideMenuPopup &&
      !isClickOnOpenButton &&
      !isClickOnMenuAccount
    ) {
      this.closeMenuPopup();
    }
  }

  handleGroupSettingsLinkClick(event) {
    event.preventDefault();
    this.closeMenuPopup();
    this.emit('groupSettingsLinkClick');
  }
}

export default new HeaderController();
