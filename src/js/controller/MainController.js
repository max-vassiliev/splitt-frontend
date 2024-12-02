import pageController from './page/PageController.js';
import modalController from './page/ModalController.js';
import headerController from './header/HeaderController.js';
import groupController from './group/GroupController.js';
import summaryController from './summary/SummaryController.js';
import transactionsController from './transactions/TransactionsController.js';
import paginationController from './pagination/PaginationController.js';
import repaymentContoller from './repayment/RepaymentController.js';
import emojiController from './emoji/EmojiController.js';
import eventBus from '../util/EventBus.js';
import { MODAL_CLOSE_REPAYMENT } from '../util/Config.js';

class MainController {
  init = async () => {
    try {
      await pageController.init();

      this.#bindEventHandlers();

      modalController.init();
      headerController.init();
      groupController.init();
      summaryController.init();
      transactionsController.init();
      paginationController.init();
      emojiController.init();
      repaymentContoller.init();

      this.#alignTransactionForms();
    } catch (error) {
      throw error;
    }
  };

  #bindEventHandlers = () => {
    this.#bindOpenModal();
    this.#bindCloseActiveModal();
    this.#bindGroupSettingsLinkClick();
    this.#bindAlignTransactionForms();
    this.#bindAlignEmojiContainer();
    this.#bindSettleDebt();
    this.#bindOpenEditRepayment();
    this.#bindRepaymentFormEmojiEdit();
    this.#bindRepaymentFormClosed();
    this.#bindDateReset();
    this.#bindEmojiRegisterField();
    this.#bindEmojiSetTopMargin();
    this.#bindEmojiPickerToggle();
    this.#bindEmojiRestoreDefault();
    this.#bindEmojiRemove();
  };

  #bindOpenModal = () => {
    eventBus.on('openModal', modalId => {
      modalController.openModal(modalId);
    });
  };

  #bindCloseActiveModal = () => {
    eventBus.on('closeActiveModal', () => {
      modalController.closeActiveModal();
    });
  };

  #bindAlignTransactionForms = () => {
    pageController.on('alignTransactionForms', this.#alignTransactionForms);
  };

  #alignTransactionForms = () => {
    repaymentContoller.alignForm();
    emojiController.alignContainer();
  };

  #bindAlignEmojiContainer = () => {
    repaymentContoller.on('alignEmojiContainer', () => {
      emojiController.alignContainer();
    });
  };

  #bindDateReset = () => {
    eventBus.on('dateReset', () => {
      repaymentContoller.updateDateInputRange();
    });
  };

  #bindGroupSettingsLinkClick = () => {
    headerController.on('groupSettingsLinkClick', () => {
      groupController.openGroupModal();
    });
  };

  #bindSettleDebt = () => {
    eventBus.on('settleDebt', selectedUserId => {
      repaymentContoller.openSettleForm(selectedUserId);
    });
  };

  #bindOpenEditRepayment = () => {
    eventBus.on('openEditRepayment', async repaymentId => {
      await repaymentContoller.openEditForm(repaymentId);
    });
  };

  #bindRepaymentFormEmojiEdit = () => {
    eventBus.on('repaymentFormEmojiEdited', editResponse => {
      repaymentContoller.handleEmojiEdit(editResponse);
    });
  };

  #bindRepaymentFormClosed = () => {
    eventBus.on(MODAL_CLOSE_REPAYMENT, () => {
      repaymentContoller.cleanupOnFormClose();
    });
  };

  #bindEmojiRegisterField = () => {
    eventBus.on('registerEmojiField', emojiField => {
      emojiController.registerEmojiField(emojiField);
    });
  };

  #bindEmojiSetTopMargin = () => {
    eventBus.on('setEmojiTopMargin', data => {
      emojiController.setFieldTopMargin(data);
    });
  };

  #bindEmojiPickerToggle = () => {
    repaymentContoller.on('emojiPickerToggle', () => {
      emojiController.toggleEmojiPicker();
    });
  };

  #bindEmojiRestoreDefault = () => {
    repaymentContoller.on('emojiRestoreDefault', defaultEmoji => {
      emojiController.restoreDefaultEmoji(defaultEmoji);
    });
  };

  #bindEmojiRemove = () => {
    repaymentContoller.on('emojiRemove', () => {
      emojiController.handleEmojiRemove();
    });
  };
}

export default new MainController();
