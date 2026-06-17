import { applyLoanInterest } from './applyLoanInterest.js'
import { testState } from "../../test-utils/testState.js";

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
