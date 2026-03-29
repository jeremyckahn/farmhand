import toolUpgrades from '../../data/upgrades.js'
import { recipesMap } from '../../data/maps.js'

/**
 * Get available upgrades based on current tool levels and unlocked recipes
 * @param {object} params - the parameters object
 * @param {array} params.learnedForgeRecipes - list of learned forge recipes from farmhand state
 * @param {object} params.toolLevels - the current level of each tool
 * @returns {array} a list of all applicable upgrades
 */
export function getUpgradesAvailable({ learnedForgeRecipes, toolLevels }) {
  let upgradesAvailable = []

  for (let type of Object.keys(toolUpgrades)) {
    const upgrade = toolUpgrades[type][toolLevels[type]]

    if (upgrade && !upgrade.isMaxLevel && upgrade.nextLevel) {
      const nextLevelUpgrade = toolUpgrades[type][upgrade.nextLevel]
      let allIngredientsUnlocked = true

      for (let ingredient of Object.keys(nextLevelUpgrade.ingredients)) {
        allIngredientsUnlocked =
          allIngredientsUnlocked &&
          !!(
            !recipesMap[ingredient] || learnedForgeRecipes.includes(ingredient)
          )
      }

      if (allIngredientsUnlocked) {
        upgradesAvailable.push(nextLevelUpgrade)
      }
    }
  }

  return upgradesAvailable
}
