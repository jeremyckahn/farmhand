import { notificationSeverity } from '../../enums.js'
import { castToMoney } from '../../utils/castToMoney.js'
import { moneyTotal } from '../../utils/moneyTotal.js'
import { LOAN_INTEREST_RATE } from '../../constants.js'
import { LOAN_BALANCE_NOTIFICATION } from '../../templates.js'

export const applyLoanInterest = (state: farmhand.state): farmhand.state => {
  const newLoanBalance = moneyTotal(
    state.loanBalance,
    castToMoney(state.loanBalance * LOAN_INTEREST_RATE)
  )

  const newDayNotifications =
    newLoanBalance > 0
      ? [
          ...state.newDayNotifications,
          {
            severity: 'warning' as notificationSeverity,
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
