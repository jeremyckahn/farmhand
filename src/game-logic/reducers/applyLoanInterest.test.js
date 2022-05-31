import { applyLoanInterest } from './applyLoanInterest'

describe('applyLoanInterest', () => {
  test('applies loan interest', () => {
    expect(
      applyLoanInterest({
        loanBalance: 100,
        newDayNotifications: [],
      }).loanBalance
    ).toEqual(102)
  })
})
