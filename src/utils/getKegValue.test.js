import { carrot, sunflower } from '../data/crops'
import { wineChardonnay, wineNebbiolo } from '../data/recipes'
import { getKegStub } from '../test-utils/stubs/getKegStub'

import { getKegValue } from './getKegValue'

describe('getKegValue', () => {
  test.each([
    // Tier 1 crop
    {
      keg: getKegStub({ itemId: carrot.id, daysUntilMature: 5 }),
      expected: 0,
    },
    {
      keg: getKegStub({ itemId: carrot.id, daysUntilMature: 0 }),
      expected: 25,
    },
    {
      keg: getKegStub({ itemId: carrot.id, daysUntilMature: -5 }),
      expected: 27.6,
    },
    {
      keg: getKegStub({ itemId: carrot.id, daysUntilMature: -50 }),
      expected: 67.29,
    },

    // Higher tier crop
    {
      keg: getKegStub({ itemId: sunflower.id, daysUntilMature: 0 }),
      expected: 708,
    },
    {
      keg: getKegStub({ itemId: sunflower.id, daysUntilMature: -5 }),
      expected: 781.69,
    },
    {
      keg: getKegStub({ itemId: sunflower.id, daysUntilMature: -50 }),
      expected: 1905.64,
    },
  ])(
    'calculates fermented crop value: (itemId: $keg.itemId, daysUntilMature: $keg.daysUntilMature) -> $expected',
    ({ keg, expected }) => {
      const rawResult = getKegValue(keg)
      const result = Number(rawResult.toFixed(2))

      expect(result).toEqual(expected)
    }
  )

  test.each([
    // Lower value wine
    {
      keg: getKegStub({ itemId: wineChardonnay.id, daysUntilMature: 5 }),
      expected: 0,
    },
    {
      keg: getKegStub({ itemId: wineChardonnay.id, daysUntilMature: 0 }),
      expected: 23836.64,
    },
    {
      keg: getKegStub({ itemId: wineChardonnay.id, daysUntilMature: -5 }),
      expected: 25299.34,
    },
    // NOTE: Wine value maxes out at 100 days
    {
      keg: getKegStub({ itemId: wineChardonnay.id, daysUntilMature: -100 }),
      expected: 104083.82,
    },
    {
      keg: getKegStub({ itemId: wineChardonnay.id, daysUntilMature: -1000 }),
      expected: 104083.82,
    },

    // Lower value wine
    {
      keg: getKegStub({ itemId: wineNebbiolo.id, daysUntilMature: 0 }),
      expected: 148729.22,
    },
    {
      keg: getKegStub({ itemId: wineNebbiolo.id, daysUntilMature: -5 }),
      expected: 157855.77,
    },
    {
      keg: getKegStub({ itemId: wineNebbiolo.id, daysUntilMature: -100 }),
      expected: 649433.19,
    },
  ])(
    'calculates wine keg value (itemId: $keg.itemId, daysUntilMature: $keg.daysUntilMature) -> $expected',
    ({ keg, expected }) => {
      const rawResult = getKegValue(keg)
      const result = Number(rawResult.toFixed(2))

      expect(result).toEqual(expected)
    }
  )
})
