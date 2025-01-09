import state from '../State.js';
import DateState from './DateState.js';
import { MIN_TRANSACTION_YEAR_LIMIT } from '../../../util/Config.js';
import eventBus from '../../../util/EventBus.js';
import EventEmitter from 'events';

class DateManager extends EventEmitter {
  init = () => {
    this.#initDate();
  };

  /**
   * Retrieves the range of available dates for transactions.
   *
   * @returns {Object} An object with the transaction date range.
   * @property {DateState} min - The minimum transaction date.
   * @property {DateState} max - The maximum transaction date.
   */
  getTransactionDateRange = () => {
    const min = state.dates.minTransactionDate;
    const max = state.dates.today;

    return { min, max };
  };

  /**
   * Retrieves the current date information.
   *
   * @returns {DateState} An object representing today's date.
   * @property {Date} date - The Date object representing today's date.
   * @property {string} string - The string representation of today's date in the format 'YYYY-MM-DD'.
   */
  getToday = () => {
    return state.dates.today;
  };

  // PRIVATE METHODS

  /**
   * Initializes the 'today' and 'minTransactionDate' {@link DateState} instances in the state.
   *
   * Initializes 'today' to the current date and 'minTransactionDate' to a date
   * calculated based on the minimum transaction year limit ({@link MIN_TRANSACTION_YEAR_LIMIT}).
   * This method is set to automatically refresh at midnight to update 'today' for a new day.
   */
  #initDate = () => {
    const { now, today, minTransactionDate } = this.#initiateKeyDates();

    const todayState = new DateState(today);
    const minTransactionDateState = new DateState(minTransactionDate);

    state.dates.today = todayState;
    state.dates.minTransactionDate = minTransactionDateState;

    this.#scheduleNextReset(now);
  };

  /**
   * Resets the 'today' and 'minTransactionDate' values in the state.
   *
   * Updates 'today' to the current date and 'minTransactionDate' to a date
   * calculated based on the minimum transaction year limit ({@link MIN_TRANSACTION_YEAR_LIMIT}).
   * This method is called at midnight to refresh 'today' for a new day.
   *
   * @emits DateManager#dateReset The 'dateReset' event.
   */
  #resetDate = () => {
    const { now, today, minTransactionDate } = this.#initiateKeyDates();

    state.dates.today.date = today;
    state.dates.minTransactionDate.date = minTransactionDate;

    this.#scheduleNextReset(now);

    eventBus.emit('dateReset');
  };

  /**
   * Schedules the next reset of the date at midnight.
   *
   * Calculates the milliseconds remaining until the next day and sets a timeout
   * to call the reset method at that time.
   *
   * @param {Date} now The current date and time.
   */
  #scheduleNextReset = now => {
    const millisecondsUntilNextDay = this.#getMillisecondsUntilNextDay(now);
    setTimeout(this.#resetDate, millisecondsUntilNextDay);
  };

  // HELPERS

  /**
   * Initiates the current date, today's date, and the minimum transaction date.
   *
   * @returns {{now: Date, today: Date, minTransactionDate: Date}} An object containing the current date, today's date, and the minimum transaction date.
   */
  #initiateKeyDates = () => {
    const now = new Date();
    const today = this.#initiateToday(now);
    const minTransactionDate = this.#initiateMinTransactionDate(today);
    return { now, today, minTransactionDate };
  };

  /**
   * Initializes today's date to the start of the day (00:00:00).
   *
   * @param {Date} now The current date and time.
   * @returns {Date} Today's date set to 00:00:00.
   */
  #initiateToday = now => {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  };

  /**
   * Initializes the minimum transaction date based on the minimum transaction year limit.
   *
   * @param {Date} today Today's date.
   * @returns {Date} The minimum transaction date.
   */
  #initiateMinTransactionDate = today => {
    const minTransactionDate = new Date(today);
    minTransactionDate.setFullYear(
      today.getFullYear() - MIN_TRANSACTION_YEAR_LIMIT
    );
    return minTransactionDate;
  };

  /**
   * Calculates the number of milliseconds until the start of the next day.
   * This function is used to determine the delay time for the next `resetDate` call.
   *
   * @param {Date} now - The current date and time.
   * @returns {number} The number of milliseconds until the next day begins (midnight).
   */
  #getMillisecondsUntilNextDay = now => {
    const nextDay = new Date(now);
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(0, 0, 10, 0);

    return nextDay - now;
  };
}

export default new DateManager();
