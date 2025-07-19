import { testState } from '../../test-utils/index.js'

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
