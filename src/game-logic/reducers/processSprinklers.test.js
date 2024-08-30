import { testCrop } from '../../test-utils'
import { getPlotContentFromItemId } from '../../utils'

import { processSprinklers } from './processSprinklers'

vitest.mock('../../data/items')

describe('processSprinklers', () => {
  let computedState

  beforeEach(() => {
    const field = new Array(8).fill().map(() => new Array(8).fill(null))
    field[0][0] = getPlotContentFromItemId('sprinkler')
    field[1][1] = getPlotContentFromItemId('sprinkler')
    field[6][5] = getPlotContentFromItemId('sprinkler')
    field[1][0] = testCrop()
    field[2][2] = testCrop()
    field[3][3] = testCrop()

    computedState = processSprinklers({
      field,
      itemsSold: {},
    })
  })

  test('waters crops within range', () => {
    expect(computedState.field[1][0].wasWateredToday).toBeTruthy()
    expect(computedState.field[2][2].wasWateredToday).toBeTruthy()
  })

  test('does not water crops out of range', () => {
    expect(computedState.field[3][3].wasWateredToday).toBeFalsy()
  })
})
