import { updatePlotShoveledState } from './updatePlotShoveledState'

describe('updatePlotShoveledState', () => {
  test('it decrements daysUntilClear if value is above 1', () => {
    const plotContents = updatePlotShoveledState({
      isShoveled: true,
      daysUntilClear: 2,
    })

    expect(plotContents).toEqual({ isShoveled: true, daysUntilClear: 1 })
  })

  test('it resets the plotContents when daysUntilClear is 1', () => {
    const plotContents = updatePlotShoveledState({
      isShoveled: true,
      daysUntilClear: 1,
    })

    expect(plotContents).toEqual(null)
  })

  test('will return the plot contents if it is anything else', () => {
    const plotContents = updatePlotShoveledState('sprinkler')

    expect(plotContents).toEqual('sprinkler')
  })
})
