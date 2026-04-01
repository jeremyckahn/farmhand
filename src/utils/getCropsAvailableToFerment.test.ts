import { carrot, pumpkin, spinach, watermelon } from '../data/crops/index.ts'

import { getCropsAvailableToFerment } from './getCropsAvailableToFerment.ts'
import { getLevelEntitlements } from './getLevelEntitlements.ts'

describe('getCropsAvailableToFerment', () => {
  test.each([
    [0, []],
    [5, [carrot, spinach, pumpkin]],
  ])(
    'calculates crops that are available for fermentation',
    (level, expectedCropsAvailableToFerment) => {
      const cropsAvailableToFerment = getCropsAvailableToFerment(
        getLevelEntitlements(level)
      )

      expect(cropsAvailableToFerment).toEqual(expectedCropsAvailableToFerment)
    }
  )

  test('should not return unfermentable crops', () => {
    const cropsAvailableToFerment = getCropsAvailableToFerment(
      getLevelEntitlements(Infinity)
    )

    expect(cropsAvailableToFerment).not.toContain(watermelon)
  })
})
