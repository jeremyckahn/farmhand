import { carrot } from '../data/crops'
import { getKegStub } from '../test-utils/stubs/getKegStub'

import { getKegValue } from './getKegValue'

describe('getKegValue', () => {
  test.each([
    {
      keg: getKegStub({ itemId: carrot.id, daysUntilMature: 5 }),
      expected: 27.6,
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
  ])(
    'calculates (itemId: $keg.itemId, daysUntilMature: $keg.daysUntilMature) -> $expected',
    ({ keg, expected }) => {
      const rawResult = getKegValue(keg)
      const result = Number(rawResult.toFixed(2))

      expect(result).toEqual(expected)
    }
  )

  xtest.each([{}])('calculates wine keg value', () => {})
})
