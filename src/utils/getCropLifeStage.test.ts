import { testCrop } from '../test-utils/index.js'
import { cropLifeStage } from '../enums.js'

import { getCropLifeStage } from './getCropLifeStage.js'

const { SEED, GROWING, GROWN } = cropLifeStage

describe('getCropLifeStage', () => {
  test('maps a life cycle label to an image name chunk', () => {
    const itemId = 'carrot'

    expect(getCropLifeStage(testCrop({ itemId, daysWatered: 0 }))).toBe(SEED)
    expect(getCropLifeStage(testCrop({ itemId, daysWatered: 2.5 }))).toBe(
      GROWING
    )
    expect(getCropLifeStage(testCrop({ itemId, daysWatered: 5 }))).toBe(GROWN)
  })
})
