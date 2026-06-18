import { cropLifeStage } from '../enums.js'

import { getLifeStageRange } from './getLifeStageRange.js'

const { SEED, GROWING, GROWN } = cropLifeStage

describe('getLifeStageRange', () => {
  test('converts a cropTimeline to an array of stages', () => {
    expect(getLifeStageRange([1, 2])).toEqual([SEED, GROWING, GROWING])
  })

  test('converts a multi-stage growing cycle into the expected stages', () => {
    expect(getLifeStageRange([2, 1, 2, 1])).toEqual([
      SEED,
      SEED,
      GROWING,
      GROWING,
      GROWING,
      GROWING,
    ])
  })
})
