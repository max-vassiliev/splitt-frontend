import pageModel from '../../model/page/PageModel.js';
import windowView from '../../view/page/WindowView.js';
import appSettings from '../../util/AppSettings.js';
import eventBus from '../../util/EventBus.js';

class PageController {
  init = async () => {
    this.#initDate();
    await this.#loadData();
    this.#initAppSettings();
    this.#bindEventHandlers();
  };

  #initDate = () => {
    pageModel.initDate();
  };

  #initAppSettings = () => {
    const { locale, currencySymbol } = pageModel.getAppSettings();
    appSettings.locale = locale;
    appSettings.currencySymbol = currencySymbol;
  };

  #loadData = async () => {
    try {
      await pageModel.loadPage();
    } catch (error) {
      throw error;
    }
  };

  #bindEventHandlers = () => {
    windowView.addHandlerResize(this.#handleWindowResize);
  };

  #handleWindowResize = () => {
    eventBus.emit('alignTransactionForms');
  };
}

export default new PageController();
