import { testState } from '../../test-utils/testState.js'

import { applyLoanInterest } from './applyLoanInterest.js'

describe('applyLoanInterest', () => {
  test('applies loan interest', () => {
    expect(
      applyLoanInterest(
        testState({
          loanBalance: 100,
          newDayNotifications: [],
        })
      ).loanBalance
    ).toEqual(102)
  })
})
