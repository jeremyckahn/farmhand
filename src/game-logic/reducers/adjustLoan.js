import { moneyTotal } from '../../utils/index.js'
import { LOAN_INCREASED, LOAN_PAYOFF } from '../../templates.js'

import { showNotification } from './showNotification.js'

/**
 * @param {farmhand.state} state
 * @param {number} adjustmentAmount This should be a negative number if the
 * loan is being paid down, positive if a loan is being taken out.
 * @returns {farmhand.state}
 */
export const adjustLoan = (state, adjustmentAmount) => {
  const loanBalance = moneyTotal(state.loanBalance, adjustmentAmount)
  const newMoney = moneyTotal(state.money, adjustmentAmount)

  const isLoanPayoff = loanBalance === 0 && adjustmentAmount < 0

  if (isLoanPayoff) {
    state = showNotification(state, LOAN_PAYOFF``, 'success')
  } else {
    const isNewLoan = adjustmentAmount > 0

    if (isNewLoan) {
      state = {
        ...showNotification(state, LOAN_INCREASED`${loanBalance}`, 'info'),
        loansTakenOut: state.loansTakenOut + 1,
      }
    }
  }

  return {
    ...state,
    loanBalance,
    money: newMoney,
  }
}
