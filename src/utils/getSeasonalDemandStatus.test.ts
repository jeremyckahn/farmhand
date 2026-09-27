import { testItem } from '../test-utils/index.js'
import { season } from '../enums.js'

import { getSeasonalDemandStatus } from './getSeasonalDemandStatus.js'

describe('getSeasonalDemandStatus', () => {
  test('returns null when the item has no demand seasons configured', () => {
    const item = testItem()

    expect(getSeasonalDemandStatus(item, season.SPRING)).toBeNull()
  })

  test('returns HIGH when the current season is a high demand season', () => {
    const item = testItem({ highDemandSeasons: [season.SUMMER] })

    expect(getSeasonalDemandStatus(item, season.SUMMER)).toEqual('HIGH')
  })

  test('returns LOW when the current season is a low demand season', () => {
    const item = testItem({ lowDemandSeasons: [season.WINTER] })

    expect(getSeasonalDemandStatus(item, season.WINTER)).toEqual('LOW')
  })

  test('returns null when the current season matches neither list', () => {
    const item = testItem({
      highDemandSeasons: [season.SUMMER],
      lowDemandSeasons: [season.WINTER],
    })

    expect(getSeasonalDemandStatus(item, season.SPRING)).toBeNull()
  })
})
