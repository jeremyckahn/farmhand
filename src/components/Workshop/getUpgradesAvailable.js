import toolUpgrades from '../../data/upgrades'
import { recipesMap } from '../../data/maps'

/**
 * Get available upgrades based on current tool levels and unlocked recipes
 * @param {array} learnedForgeRecipes - list of learned forge recipes from farmhand state
 * @param {object} toolLevels - the current level of each tool
 * @returns {array} a list of all applicable upgrades
 */
export function getUpgradesAvailable({ learnedForgeRecipes, toolLevels }) {
  let upgradesAvailable = []
  const learnedRecipeIds = learnedForgeRecipes.map(r => r.id)

  for (let type of Object.keys(toolUpgrades)) {
    const upgrade = toolUpgrades[type][toolLevels[type]]

    if (upgrade && !upgrade.isMaxLevel && upgrade.nextLevel) {
      const nextLevelUpgrade = toolUpgrades[type][upgrade.nextLevel]
      let allIngredientsUnlocked = true

      for (let ingredient of Object.keys(nextLevelUpgrade.ingredients)) {
        allIngredientsUnlocked =
          allIngredientsUnlocked &&
          !!(!recipesMap[ingredient] || learnedRecipeIds.includes(ingredient))
      }

      if (allIngredientsUnlocked) {
        upgradesAvailable.push(nextLevelUpgrade)
      }
    }
  }

  return upgradesAvailable
}
