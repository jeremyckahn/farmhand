import { LOAN_INCREASED, LOAN_PAYOFF } from '../../templates'

import { adjustLoan } from './adjustLoan'

describe('adjustLoan', () => {
  test('updates state', () => {
    expect(
      adjustLoan({ money: 100, loanBalance: 50, todaysNotifications: [] }, -25)
    ).toEqual({
      money: 75,
      loanBalance: 25,
      todaysNotifications: [],
    })
  })

  describe('loan payoff', () => {
    test('shows appropriate notification', () => {
      const { loansTakenOut, todaysNotifications } = adjustLoan(
        {
          money: 100,
          loanBalance: 50,
          loansTakenOut: 1,
          todaysNotifications: [],
        },
        -50
      )

      expect(todaysNotifications).toEqual([
        { message: LOAN_PAYOFF``, severity: 'success' },
      ])

      expect(loansTakenOut).toEqual(1)
    })
  })

  describe('loan increase', () => {
    test('shows appropriate notification, updates state', () => {
      const { loansTakenOut, todaysNotifications } = adjustLoan(
        {
          money: 100,
          loanBalance: 50,
          todaysNotifications: [],
          loansTakenOut: 1,
        },
        50
      )

      expect(todaysNotifications).toEqual([
        { message: LOAN_INCREASED`${100}`, severity: 'info' },
      ])

      expect(loansTakenOut).toEqual(2)
    })
  })
})
