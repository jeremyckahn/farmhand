import { castToMoney, moneyTotal } from '../../utils/index.tsx'
import { LOAN_INTEREST_RATE } from '../../constants.ts'
import { LOAN_BALANCE_NOTIFICATION } from '../../templates.ts'

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const applyLoanInterest = state => {
  const newLoanBalance = moneyTotal(
    state.loanBalance,
    castToMoney(state.loanBalance * LOAN_INTEREST_RATE)
  )

  const newDayNotifications =
    newLoanBalance > 0
      ? [
          ...state.newDayNotifications,
          {
            severity: /** @type {farmhand.notificationSeverity} */ 'warning',
            message: LOAN_BALANCE_NOTIFICATION('', newLoanBalance),
          },
        ]
      : state.newDayNotifications

  return {
    ...state,
    loanBalance: newLoanBalance,
    newDayNotifications,
  }
}
