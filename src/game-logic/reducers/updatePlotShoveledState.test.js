import { fertilizerType } from '../../enums.js'

import { updatePlotShoveledState } from './updatePlotShoveledState.js'

describe('updatePlotShoveledState', () => {
  test('it decrements daysUntilClear if value is above 1', () => {
    const plotContents = updatePlotShoveledState({
      itemId: 'test-item',
      fertilizerType: fertilizerType.NONE,
      isShoveled: true,
      daysUntilClear: 2,
    })

    expect(plotContents).toEqual({
      itemId: 'test-item',
      fertilizerType: fertilizerType.NONE,
      isShoveled: true,
      daysUntilClear: 1,
    })
  })

  test('it resets the plotContents when daysUntilClear is 1', () => {
    const plotContents = updatePlotShoveledState({
      itemId: 'test-item',
      fertilizerType: fertilizerType.NONE,
      isShoveled: true,
      daysUntilClear: 1,
    })

    expect(plotContents).toEqual(null)
  })

  test('will return the plot contents if it is anything else', () => {
    // @ts-expect-error - Testing with string type to verify non-shoveled plot handling
    const plotContents = updatePlotShoveledState('sprinkler')

    expect(plotContents).toEqual('sprinkler')
  })
})
