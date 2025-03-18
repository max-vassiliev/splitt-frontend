import {
  DEFAULT_AMOUNT,
  EXPENSE_BALANCE_DEFAULT,
  EXPENSE_BALANCE_CHECK_PAID_BY,
  EXPENSE_BALANCE_CHECK_SPLITT,
  EXPENSE_BALANCE_AMOUNT_BELOW_MIN,
  EXPENSE_BALANCE_AMOUNT_ZERO,
  EXPENSE_BALANCE_STATUSES,
} from '../../../../util/Config.js';
import ExpenseFormState from '../../../state/expense/ExpenseFormState.js';
import PaidByState from '../../../state/expense/paid-by/PaidByState.js';
import PaidByEntry from '../../../state/expense/paid-by/PaidByEntry.js';
import SplittEquallyState from '../../../state/expense/splitt/SplittEquallyState.js';
import SplittPartsState from '../../../state/expense/splitt/SplittPartsState.js';
import SplittSharesState from '../../../state/expense/splitt/SplittSharesState.js';

class ExpenseBalanceService {
  /**
   * Gets the status for the Balance Note inside the Expense Form.
   *
   * If the Splitt or Paid By forms are invalid, returns the status
   * highlighting that the forms need to be checked.
   *
   * If the the forms are valid, returns the current user's balance
   * for the expense.
   *
   * @param {ExpenseFormState} expenseData The expense form state.
   * @param {bigint} currentUserId The current user's ID.
   * @returns {Object} The object containing the balance details
   * @property {string} status The balance status.
   *                           One of {@link EXPENSE_BALANCE_STATUSES}.
   * @property {number} amount The current user's balance in the expense (optional).
   */
  getBalance = (expenseData, currentUserId) => {
    const {
      amount: expenseAmount,
      splitt: splittData,
      paidBy: paidByData,
      isAmountBelowMin,
    } = expenseData;

    if (isAmountBelowMin) {
      return { status: EXPENSE_BALANCE_AMOUNT_BELOW_MIN };
    }

    if (expenseAmount === DEFAULT_AMOUNT) {
      return { status: EXPENSE_BALANCE_AMOUNT_ZERO };
    }

    if (!paidByData.isValid) {
      return { status: EXPENSE_BALANCE_CHECK_PAID_BY };
    }

    if (!splittData.activeForm.isValid) {
      return { status: EXPENSE_BALANCE_CHECK_SPLITT };
    }

    const status = EXPENSE_BALANCE_DEFAULT;
    const amount = this.#countBalanceAmount({
      paidByData,
      splittData,
      currentUserId,
    });

    return { status, amount };
  };

  /**
   * Counts the current user's balance for the expense.
   *
   * @param {Object} params The object containing the data required to calculate the balance.
   * @param {PaidByState} params.paidByData The Paid By subform state.
   * @param {SplittEquallyState|SplittPartsState|SplittSharesState} params.splittData The Splitt subform state.
   * @param {bigint} params.currentUserId The current user's ID.
   * @returns {number} The current user's balance amount.
   */
  #countBalanceAmount = ({ paidByData, splittData, currentUserId }) => {
    const userPaidByAmount = this.#getUserPaidByAmount(
      paidByData.entries,
      currentUserId
    );
    const userSplittAmount = this.#getUserSplittAmount(
      splittData.activeForm.getSplittAmounts(),
      currentUserId
    );

    return userPaidByAmount - userSplittAmount;
  };

  /**
   * Gets the user's amount form the Splitt subform.
   *
   * @param {Map<bigint,number>} splittAmounts The map containing the "Splitt" form amounts for all user's in the group.
   * @param {bigint} userId The current user's ID.
   * @returns {number} The user's amount form the Splitt subform.
   */
  #getUserSplittAmount = (splittAmounts, userId) => {
    const userSplittAmount = splittAmounts.get(userId);
    return userSplittAmount ? userSplittAmount : DEFAULT_AMOUNT;
  };

  /**
   * Gets the user's amount form the Paid By subform.
   *
   * @param {Map<number, PaidByEntry>} paidByEntries The "entries" map from [PaidByState]{@link PaidByState}.
   * @param {bigint} userId The current user's ID.
   * @returns {number} The user's amount form the Paid By subform.
   */
  #getUserPaidByAmount = (paidByEntries, userId) => {
    const userEntry = paidByEntries
      .entries()
      .find(([_, entry]) => entry.userId === userId);

    return userEntry ? userEntry[1].amount : DEFAULT_AMOUNT;
  };
}

export default new ExpenseBalanceService();
