import { itemsMap } from './maps.js'

describe('itemsMap', () => {
  test('no item declares the same season as both high and low demand', () => {
    const itemsWithOverlappingDemandSeasons = Object.values(
      itemsMap
    ).filter(({ highDemandSeasons, lowDemandSeasons }) =>
      highDemandSeasons?.some(season => lowDemandSeasons?.includes(season))
    )

    expect(itemsWithOverlappingDemandSeasons).toEqual([])
  })
})
