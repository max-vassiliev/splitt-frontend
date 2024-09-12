import groupModel from '../model/group/GroupModel.js';
import groupHeaderView from '../view/GroupHeaderView.js';
import groupModalView from '../view/GroupModalView.js';
import modalService from './util/ModalService.js';

class GroupController {
  constructor() {
    this.openGroupModal = this.openGroupModal.bind(this);
    this.closeGroupModal = this.closeGroupModal.bind(this);
    this.selectGroup = this.selectGroup.bind(this);
  }

  openGroupModal() {
    const groupModalElement = groupModalView.getGroupModal();
    modalService.openModal(groupModalElement);
  }

  closeGroupModal() {
    modalService.closeActiveModal();
  }

  selectGroup(event) {
    const selectedValue = event.target.value;

    if (selectedValue === null || selectedValue === undefined) return;

    const selectedGroupId = parseInt(selectedValue, 10);
    const currentGroupId = groupModel.getCurrentGroupId();

    selectedGroupId === currentGroupId
      ? groupModalView.deactivateGroupSwitchBtn()
      : groupModalView.activateGroupSwitchBtn();
  }

  #loadData() {
    const groupData = groupModel.getCurrentGroupTitleAndAvatar();
    groupHeaderView.render(groupData);
    groupModalView.renderHeader(groupData);
  }

  #setupHandlers() {
    groupHeaderView.addHandlerClick(this.openGroupModal);
    groupModalView.addHandlerGroupModalCloseBtnClick(this.closeGroupModal);
    groupModalView.addHandlerGroupSwitchChange(this.selectGroup);
  }

  init() {
    this.#loadData();
    this.#setupHandlers();
  }
}

export default new GroupController();
