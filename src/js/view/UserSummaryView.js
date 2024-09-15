import {
  AMOUNT_COLOR_POSITIVE,
  AMOUNT_COLOR_NEGATIVE,
} from '../util/Config.js';
import { getAvatarUrl, formatAmountForOutput } from './util/RenderHelper.js';

class UserSummaryView {
  #container;
  #renderers;

  constructor() {
    this.#container = document.querySelector('.user-summary-container');
    this.#renderers = new Map([
      ['neutral', this.#generateNeutralHTML.bind(this)],
      ['negative', this.#generateNegativeHTML.bind(this)],
      ['positive', this.#generatePositiveHTML.bind(this)],
    ]);
  }

  addHandlerContainerClick(handler) {
    this.#container.addEventListener('click', handler);
  }

  #clear() {
    this.#container.innerHTML = '';
  }

  render(data) {
    this.#validateRenderData(data);
    const generateHTML = this.#renderers.get(data.status);
    if (!generateHTML) {
      throw new Error(
        `Invalid status. Received: ${data.status} (${typeof data.status})`
      );
    }

    const summaryHTML = generateHTML(data);
    this.#clear();
    this.#container.insertAdjacentHTML('afterbegin', summaryHTML);
  }

  #validateRenderData(data) {
    if (
      !data ||
      !data.status ||
      !data.details ||
      !Array.isArray(data.details)
    ) {
      throw new Error(
        `Invalid data for user status rendering. Expected an object object with the fields "status" (String) and "details" (Array). Received: ${data} (${typeof data})`
      );
    }
  }

  #generateNeutralHTML(data) {
    return `
      <div class="summary user-summary status-neutral">
        <h2>Дзен</h2>
        <p>Всё сходится: не нужно делать<br />или&nbsp;ожидать перевод.</p>
      </div>
    `;
  }

  #generateNegativeHTML(data) {
    const { details, locale, currencySymbol } = data;

    let summaryHTML = `
        <div class="summary user-summary status-negative">
          <h2>Сделайте перевод</h2>
          <p>
            Чтобы восстановить баланс в группе, переведите деньги пользователям:
          </p>
          <div class="summary__table">
    `;

    details.forEach(detail => {
      const rowData = {
        ...detail,
        amountColor: AMOUNT_COLOR_NEGATIVE,
        locale,
        currencySymbol,
      };

      const rowHTML = this.#generateRowHTML(rowData);
      summaryHTML += rowHTML;
    });

    summaryHTML += '</div></div>';

    return summaryHTML;
  }

  #generatePositiveHTML(data) {
    const { details, locale, currencySymbol } = data;

    let summaryHTML = `
        <div class="summary user-summary status-positive">
          <h2>Ожидайте перевод</h2>
            <p>
              Чтобы в группе восстановился баланс, ожидайте перевод от пользователей:
            </p>
          <div class="summary__table">
    `;

    details.forEach(detail => {
      const rowData = {
        ...detail,
        amountColor: AMOUNT_COLOR_POSITIVE,
        locale,
        currencySymbol,
      };

      const rowHTML = this.#generateRowHTML(rowData);
      summaryHTML += rowHTML;
    });

    summaryHTML += '</div></div>';

    return summaryHTML;
  }

  #generateRowHTML(data) {
    const {
      userId,
      username,
      avatar,
      amount,
      amountColor,
      locale,
      currencySymbol,
    } = data;

    const avatarUrl = getAvatarUrl(avatar);
    const formattedAmount = formatAmountForOutput(amount, {
      locale: locale,
      currencySymbol: currencySymbol,
    });

    const rowHTML = `
        <div class="summary__table--row" title="рассчитаться" data-user-id="${userId}">
          <img
            class="account__avatar"
            src="${avatarUrl}"
            alt="${username}"
          />
          <div class="summary__table--user">${username}</div>
          <div class="summary__table--amount ${amountColor}">
            ${formattedAmount}
          </div>
        </div>`;

    return rowHTML;
  }
}

export default new UserSummaryView();
