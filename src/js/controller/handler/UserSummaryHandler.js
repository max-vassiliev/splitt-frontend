class UserSummaryHandler {
  #userSummaryClickHandlers;

  constructor() {
    this.#userSummaryClickHandlers = new Map([
      ['positive', this.#handleStatusPositiveClick.bind(this)],
      ['negative', this.#handleStatusNegativeClick.bind(this)],
    ]);
    this.handleContainerClick = this.handleContainerClick.bind(this);
  }

  /**
   * Handles click events on the user summary container.
   *
   * Invokes the relevant handler, when the user's balance status is 'positive' or 'negative'.
   * In other cases, does nothing.
   *
   * @param {Event} event - The click event.
   */
  handleContainerClick(event) {
    const summarySection = event.target.closest('.user-summary');
    if (!summarySection) return;

    const statusTypeClass = Array.from(summarySection.classList).find(
      statusClass => statusClass.startsWith('status-')
    );
    if (!statusTypeClass || statusTypeClass === 'status-neutral') return;

    const statusType = statusTypeClass.split('-')[1];

    const handleStatusClick = this.#userSummaryClickHandlers.get(statusType);
    if (!handleStatusClick) return;

    handleStatusClick(event);
  }

  /**
   * Handles click events on user summary container when the user's status is positive.
   * @param {Event} event - The click event.
   */
  #handleStatusPositiveClick = function (event) {
    const selectedRow = event.target.closest('.summary__table--row');
    if (!selectedRow) return;

    console.log('STATUS: Positive');
  };

  /**
   * Handles click events on user summary container when the user's status is negative.
   * @param {Event} event - The click event.
   */
  #handleStatusNegativeClick = function (event) {
    const selectedRow = event.target.closest('.summary__table--row');
    if (!selectedRow) return;

    console.log('STATUS: Negative');
  };
}

export default new UserSummaryHandler();
