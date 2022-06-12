import { castToMoney, moneyTotal } from '../../utils'
import { LOAN_INTEREST_RATE } from '../../constants'
import { LOAN_BALANCE_NOTIFICATION } from '../../templates'

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
            severity: 'warning',
            message: LOAN_BALANCE_NOTIFICATION`${newLoanBalance}`,
          },
        ]
      : state.newDayNotifications

  return {
    ...state,
    loanBalance: newLoanBalance,
    newDayNotifications,
  }
}
