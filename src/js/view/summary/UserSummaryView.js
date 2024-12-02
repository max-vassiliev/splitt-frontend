import {
  AMOUNT_COLOR_POSITIVE,
  AMOUNT_COLOR_NEGATIVE,
} from '../../util/Config.js';
import { getAvatarUrl, formatAmountForOutput } from '../util/RenderHelper.js';

class UserSummaryView {
  #rowClassName = '.summary__table--row';
  #container;
  #renderers;
  #data;

  constructor() {
    this.#container = document.querySelector('.user-summary-container');
    this.#renderers = new Map([
      ['neutral', this.#generateNeutralHTML.bind(this)],
      ['negative', this.#generateNegativeHTML.bind(this)],
      ['positive', this.#generatePositiveHTML.bind(this)],
    ]);
  }

  #clear() {
    this.#container.innerHTML = '';
  }

  // Handlers

  addHandlerContainerClick(handler) {
    this.#container.addEventListener('click', handler);
  }

  // Render

  render(data) {
    this.#validateRenderData(data);
    this.#data = data;
    const generateHTML = this.#renderers.get(this.#data.status);
    if (!generateHTML) {
      throw new Error(
        `Invalid status. Received: ${this.#data.status} (${typeof this.#data
          .status})`
      );
    }

    const summaryHTML = generateHTML();
    this.#clear();
    this.#container.insertAdjacentHTML('afterbegin', summaryHTML);
  }

  // Get

  /**
   * Retrieves the user ID from the closest row element.
   *
   * @param {Element} targetElement - The element that was clicked.
   * @returns {string|null} The user ID if found, otherwise null.
   */
  getSelectedUserId = targetElement => {
    const rowElement = targetElement.closest(this.#rowClassName);
    const selectedUserId = rowElement?.dataset.userId;
    return selectedUserId || null;
  };

  // Generate HTML

  #generateNeutralHTML() {
    return `
      <div class="summary user-summary status-neutral">
        <h2>Дзен</h2>
        <p>Всё сходится: не нужно делать<br />или&nbsp;ожидать перевод.</p>
      </div>
    `;
  }

  #generateNegativeHTML() {
    const { details, locale, currencySymbol } = this.#data;

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

  #generatePositiveHTML() {
    const { details, locale, currencySymbol } = this.#data;

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

  #generateRowHTML(rowData) {
    const {
      userId,
      username,
      avatar,
      amount,
      amountColor,
      locale,
      currencySymbol,
    } = rowData;

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

  // Validation

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
}

export default new UserSummaryView();
