import { toolLevel } from '../enums.js'

import { getChopWoodYieldRange } from './getChopWoodYieldRange.js'

describe('getChopWoodYieldRange', () => {
  test('returns the full tier range for a fully grown tree', () => {
    expect(getChopWoodYieldRange(toolLevel.GOLD, true)).toEqual([8, 10])
    expect(getChopWoodYieldRange(toolLevel.DEFAULT, true)).toEqual([1, 2])
  })

  test('halves the range (floored, minimum 1) for an immature tree', () => {
    expect(getChopWoodYieldRange(toolLevel.GOLD, false)).toEqual([4, 5])
    expect(getChopWoodYieldRange(toolLevel.DEFAULT, false)).toEqual([1, 1])
  })

  test('returns null for a tool level with no configured range', () => {
    expect(getChopWoodYieldRange(toolLevel.UNAVAILABLE, true)).toBeNull()
  })
})
