import { getKegStub } from '../test-utils/stubs/getKegStub'

import { getKegSpoilageRate } from './getKegSpoilageRate'

describe('getKegSpoilageRate', () => {
  test('handles kegs that are not mature', () => {
    const keg = getKegStub()
    expect(getKegSpoilageRate(keg)).toEqual(0)
  })

  test('handles kegs that are mature', () => {
    const keg = getKegStub({ daysUntilMature: 0 })
    expect(getKegSpoilageRate(keg)).toEqual(0)
  })

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
