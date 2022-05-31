import { castToMoney, moneyTotal } from '../../utils'
import { LOAN_INTEREST_RATE } from '../../constants'
import { LOAN_BALANCE_NOTIFICATION } from '../../templates'

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const applyLoanInterest = state => {
  const loanBalance = moneyTotal(
    state.loanBalance,
    castToMoney(state.loanBalance * LOAN_INTEREST_RATE)
  )

  const newDayNotifications =
    loanBalance > 0
      ? [
          ...state.newDayNotifications,
          {
            severity: 'warning',
            message: LOAN_BALANCE_NOTIFICATION`${loanBalance}`,
          },
        ]
      : state.newDayNotifications

  return {
    ...state,
    loanBalance,
    newDayNotifications,
  }
}
