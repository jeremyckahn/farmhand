import { testState } from '../../test-utils/index.ts'

import { applyLoanInterest } from './applyLoanInterest.ts'

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
