import { carrot } from '../data/crops'
import { wineChardonnay } from '../data/recipes'
import { getKegStub } from '../test-utils/stubs/getKegStub'

import { getKegSpoilageRate } from './getKegSpoilageRate'

describe('getKegSpoilageRate', () => {
  test('handles kegs that are not mature', () => {
    const keg = getKegStub()
    expect(getKegSpoilageRate(keg)).toEqual(0)
  })

  test.each([
    { keg: getKegStub({ itemId: carrot.id, daysUntilMature: 0 }), expected: 0 },
    {
      keg: getKegStub({ itemId: carrot.id, daysUntilMature: -10 }),
      expected: 0.01,
    },
    {
      keg: getKegStub({ itemId: wineChardonnay.id, daysUntilMature: 0 }),
      expected: 0,
    },
    {
      keg: getKegStub({ itemId: wineChardonnay.id, daysUntilMature: -10 }),
      expected: 0,
    },
  ])(
    'calculates spoilage rate for (item: $keg.itemId, daysUntilMature: $keg.daysUntilMature) -> $expected',
    ({ keg, expected }) => {
      const result = getKegSpoilageRate(keg)

      expect(result).toEqual(expected)
    }
  )

  test.each([
    [-1, 0.001],
    [-10, 0.01],
    [-100, 0.1],
  ])(
    'handles kegs that are beyond mature',
    (daysUntilMature, expectedSpoilageRate) => {
      const keg = getKegStub({ daysUntilMature })
      expect(getKegSpoilageRate(keg)).toEqual(expectedSpoilageRate)
    }
  )
})
