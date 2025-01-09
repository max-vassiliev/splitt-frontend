import groupModel from '../../model/group/GroupModel.js';
import groupHeaderView from '../../view/group/GroupHeaderView.js';
import groupModalView from '../../view/group/GroupModalView.js';
import modalView from '../../view/page/ModalView.js';
import eventBus from '../../util/EventBus.js';
import { MODAL_ID_GROUP } from '../../util/Config.js';
import { isNumericString } from '../../util/SplittValidator.js';

class GroupController {
  init = () => {
    this.#loadData();
    this.#bindEventHandlers();
  };

  #loadData = () => {
    const groupData = groupModel.getCurrentGroupData();
    groupHeaderView.render(groupData);
    groupModalView.render(groupData);
    this.#registerModal();
  };

  #registerModal = () => {
    const modalElement = groupModalView.getGroupModal();
    modalView.registerModal(MODAL_ID_GROUP, modalElement);
  };

  #loadGroupOptions = async () => {
    const groupOptions = await groupModel.getGroupOptions();
    if (!groupOptions) return;
    groupModalView.renderSwitchOptions(groupOptions);
  };

  #bindEventHandlers = () => {
    groupHeaderView.addHandlerClick(this.openGroupModal);
    groupModalView.addHandlerGroupModalCloseBtnClick(this.#closeGroupModal);
    groupModalView.addHandlerGroupSwitchChange(this.#selectGroup);
  };

  openGroupModal = async () => {
    eventBus.emit('openModal', MODAL_ID_GROUP);
    await this.#loadGroupOptions();
  };

  #closeGroupModal = () => {
    eventBus.emit('closeActiveModal');
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
