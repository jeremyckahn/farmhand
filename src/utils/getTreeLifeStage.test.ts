import { cropLifeStage } from '../enums.js'

import { getTreeLifeStage } from './getTreeLifeStage.js'

const { SEED, GROWING, GROWN } = cropLifeStage

describe('getTreeLifeStage', () => {
  test('maps a life cycle label to an image name chunk', () => {
    const itemId = 'apple'
    const daysSinceLastHarvest = 0

    expect(getTreeLifeStage({ itemId, daysOld: 0, daysSinceLastHarvest })).toBe(
      SEED
    )
    expect(getTreeLifeStage({ itemId, daysOld: 7, daysSinceLastHarvest })).toBe(
      GROWING
    )
    expect(
      getTreeLifeStage({ itemId, daysOld: 25, daysSinceLastHarvest })
    ).toBe(GROWN)
  })
})
