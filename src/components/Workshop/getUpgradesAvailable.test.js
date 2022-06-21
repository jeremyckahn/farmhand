import { toolLevel, toolType } from '../../enums'

import { getUpgradesAvailable } from './getUpgradesAvailable'

describe('getUpgradesAvailable', () => {
  const toolLevels = {
    [toolType.HOE]: toolLevel.DEFAULT,
    [toolType.SCYTHE]: toolLevel.DEFAULT,
    [toolType.SHOVEL]: toolLevel.UNAVAILABLE,
    [toolType.WATERING_CAN]: toolLevel.DEFAULT,
  }

  test('it returns an empty list if no upgrades are available', () => {
    const availableUpgrades = getUpgradesAvailable({
      toolLevels,
      learnedForgeRecipes: [],
    })

    expect(availableUpgrades).toEqual([])
  })

  test('it returns a list of available upgrades when required recipes have been learned', () => {
    const learnedForgeRecipes = [{ id: 'bronze-ingot' }]

    const availableUpgrades = getUpgradesAvailable({
      toolLevels,
      learnedForgeRecipes,
    }).map(item => item.id)

    expect(availableUpgrades).toEqual(['hoe-bronze', 'scythe-bronze'])
  })
})
