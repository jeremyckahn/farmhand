import { testState } from '../../test-utils/index.js'
import { LOAN_INCREASED, LOAN_PAYOFF } from '../../templates.js'

import { adjustLoan } from './adjustLoan.js'

describe('adjustLoan', () => {
  test('updates state', () => {
    expect(
      adjustLoan(
        testState({
          money: 100,
          loanBalance: 50,
          todaysNotifications: [],
        }),
        -25
      )
    ).toEqual(
      testState({
        money: 75,
        loanBalance: 25,
        todaysNotifications: [],
      })
    )
  })

  describe('loan payoff', () => {
    test('shows appropriate notification', () => {
      const { loansTakenOut, todaysNotifications } = adjustLoan(
        testState({
          money: 100,
          loanBalance: 50,
          loansTakenOut: 1,
          todaysNotifications: [],
        }),
        -50
      )

      expect(todaysNotifications).toEqual([
        { message: LOAN_PAYOFF(), severity: 'success' },
      ])

      expect(loansTakenOut).toEqual(1)
    })
  })

  describe('loan increase', () => {
    test('shows appropriate notification, updates state', () => {
      const { loansTakenOut, todaysNotifications } = adjustLoan(
        testState({
          money: 100,
          loanBalance: 50,
          todaysNotifications: [],
          loansTakenOut: 1,
        }),
        50
      )

      expect(todaysNotifications).toEqual([
        { message: LOAN_INCREASED('', 100), severity: 'info' },
      ])

      expect(loansTakenOut).toEqual(2)
    })
  })
})
