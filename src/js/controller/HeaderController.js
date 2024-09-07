import userModel from '../model/user/UserModel.js';
import headerView from '../view/HeaderView.js';

class HeaderController {
  constructor() {
    this.handleClickOutsideMenuPopup =
      this.handleClickOutsideMenuPopup.bind(this);
    this.openMenuPopup = this.openMenuPopup.bind(this);
    this.closeMenuPopup = this.closeMenuPopup.bind(this);
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

  init() {
    const userData = userModel.getCurrentUserNameAndAvatar();
    headerView.renderHeader(userData);

    headerView.addHandlerOpenMenuPopup(this.openMenuPopup);
    headerView.addHandlerCloseMenuPopup(this.closeMenuPopup);
  }
}

export default new HeaderController();
