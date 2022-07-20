import { resetWasShoveled } from './resetWasShoveled'

describe('resetWasShoveled', () => {
  let plotContents

  beforeEach(() => {
    plotContents = {
      isShoveled: true,
      daysUntilClear: 0,
      wasJustShoveled: true,
    }
  })

  test('it decrements daysUntilClear and updates wasJustShoveled if value is above 1', () => {
    plotContents.daysUntilClear = 2

    expect(resetWasShoveled(plotContents)).toEqual({
      isShoveled: true,
      daysUntilClear: 1,
      wasJustShoveled: false,
    })
  })

  test('it resets the plotContents when daysUntilClear is 1', () => {
    plotContents.daysUntilClear = 1

    expect(resetWasShoveled(plotContents)).toEqual(null)
  })

  test('will return the plot contents if it is anything else', () => {
    plotContents = 'sprinkler'

    expect(resetWasShoveled(plotContents)).toEqual('sprinkler')
  })
})
