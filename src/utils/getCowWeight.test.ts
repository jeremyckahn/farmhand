import { getCowWeight } from './getCowWeight.js'
import { generateCow } from './generateCow.js'

describe('getCowWeight', () => {
  test('computes cow value', () => {
    expect(
      getCowWeight(generateCow({ baseWeight: 100, weightMultiplier: 2 }))
    ).toEqual(200)
  })
})
