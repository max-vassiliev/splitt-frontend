import pageController from './page/PageController.js';
import modalController from './page/ModalController.js';
import headerController from './header/HeaderController.js';
import groupController from './group/GroupController.js';
import summaryController from './summary/SummaryController.js';
import transactionsController from './transactions/TransactionsController.js';
import paginationController from './pagination/PaginationController.js';
import expenseController from './form/expense/ExpenseController.js';
import repaymentContoller from './form/repayment/RepaymentController.js';
import emojiController from './form/emoji/EmojiController.js';
import eventBus from '../util/EventBus.js';
import { EVENT_REPAYMENT_EMOJI_EDIT } from '../util/Config.js';

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
      expenseController.init();

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
    // pageController.on('alignTransactionForms', this.#alignTransactionForms);
    eventBus.on('alignTransactionForms', this.#alignTransactionForms);
  };

  #alignTransactionForms = () => {
    expenseController.alignForm();
    repaymentContoller.alignForm();
    emojiController.alignContainer();
  };

  #bindAlignEmojiContainer = () => {
    eventBus.on('alignEmojiContainer', () => {
      emojiController.alignContainer();
    });
  };

  #bindDateReset = () => {
    eventBus.on('dateReset', () => {
      repaymentContoller.updateDateInputRange();
    });
  };

  #bindGroupSettingsLinkClick = () => {
    eventBus.on('groupSettingsLinkClick', () => {
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
    eventBus.on(EVENT_REPAYMENT_EMOJI_EDIT, editResponse => {
      repaymentContoller.handleEmojiEdit(editResponse);
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
    eventBus.on('emojiPickerToggle', () => {
      emojiController.toggleEmojiPicker();
    });
  };

  #bindEmojiRestoreDefault = () => {
    eventBus.on('emojiRestoreDefault', defaultEmoji => {
      emojiController.restoreDefaultEmoji(defaultEmoji);
    });
  };

  #bindEmojiRemove = () => {
    eventBus.on('emojiRemove', () => {
      emojiController.handleEmojiRemove();
    });
  };
}

export default new MainController();
