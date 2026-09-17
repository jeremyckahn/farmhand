import { testItem } from '../test-utils/index.js'
import { season } from '../enums.js'
import {
  SEASON_HIGH_DEMAND_BONUS,
  SEASON_LOW_DEMAND_PENALTY,
} from '../constants.js'

import { getSeasonalDemandMultiplier } from './getSeasonalDemandMultiplier.js'

describe('getSeasonalDemandMultiplier', () => {
  test('returns 1 for an item with no demand seasons configured', () => {
    const item = testItem()

    expect(getSeasonalDemandMultiplier(item, season.SPRING)).toEqual(1)
  })

  test('returns the high demand bonus multiplier during a high demand season', () => {
    const item = testItem({ highDemandSeasons: [season.SUMMER] })

    expect(getSeasonalDemandMultiplier(item, season.SUMMER)).toEqual(
      1 + SEASON_HIGH_DEMAND_BONUS
    )
  })

  test('returns the low demand penalty multiplier during a low demand season', () => {
    const item = testItem({ lowDemandSeasons: [season.WINTER] })

    expect(getSeasonalDemandMultiplier(item, season.WINTER)).toEqual(
      1 - SEASON_LOW_DEMAND_PENALTY
    )
  })

  test('returns 1 outside of the configured demand seasons', () => {
    const item = testItem({
      highDemandSeasons: [season.SUMMER],
      lowDemandSeasons: [season.WINTER],
    })

    expect(getSeasonalDemandMultiplier(item, season.SPRING)).toEqual(1)
  })
})
