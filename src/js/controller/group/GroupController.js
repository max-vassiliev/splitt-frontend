import groupModel from '../../model/group/GroupModel.js';
import groupHeaderView from '../../view/group/GroupHeaderView.js';
import groupModalView from '../../view/group/GroupModalView.js';
import modalService from '../util/ModalService.js';
import { isNumericString } from '../../util/SplittValidator.js';

class GroupController {
  constructor() {
    this.#openGroupModal = this.#openGroupModal.bind(this);
    this.#closeGroupModal = this.#closeGroupModal.bind(this);
    this.#selectGroup = this.#selectGroup.bind(this);
    this.#loadGroupOptions = this.#loadGroupOptions.bind(this);
  }

  init() {
    this.#loadData();
    this.#bindEventHandlers();
  }

  #loadData = () => {
    const groupData = groupModel.getCurrentGroupData();
    groupHeaderView.render(groupData);
    groupModalView.render(groupData);
  };

  #bindEventHandlers = () => {
    groupHeaderView.addHandlerClick(this.#openGroupModal);
    groupModalView.addHandlerGroupModalCloseBtnClick(this.#closeGroupModal);
    groupModalView.addHandlerGroupSwitchChange(this.#selectGroup);
  };

  #openGroupModal = async () => {
    const groupModalElement = groupModalView.getGroupModal();
    modalService.openModal(groupModalElement);
    await this.#loadGroupOptions();
  };

  #loadGroupOptions = async () => {
    const groupOptions = await groupModel.getGroupOptions();
    if (!groupOptions) return;
    groupModalView.renderSwitchOptions(groupOptions);
  };

  #closeGroupModal = () => {
    modalService.closeActiveModal();
  };

  #selectGroup = event => {
    const selectedValue = event.target.value;

    if (
      selectedValue === null ||
      selectedValue === undefined ||
      !isNumericString(selectedValue)
    ) {
      return;
    }

    const selectedGroupId = BigInt(selectedValue);
    const currentGroupId = groupModel.getCurrentGroupId();

    selectedGroupId === currentGroupId
      ? groupModalView.deactivateGroupSwitchBtn()
      : groupModalView.activateGroupSwitchBtn();
  };
}

export default new GroupController();
