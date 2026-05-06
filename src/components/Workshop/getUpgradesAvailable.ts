import toolUpgrades from '../../data/upgrades.js'
import { recipesMap } from '../../data/maps.js'

/**
 * Get available upgrades based on current tool levels and unlocked recipes
 * @param params - the parameters object
 * @param params.learnedForgeRecipes - list of learned forge recipes from farmhand state
 * @param params.toolLevels - the current level of each tool
 * @returns a list of all applicable upgrades
 */
interface GetUpgradesAvailableArgs {
  learnedForgeRecipes: string[]
  toolLevels: Record<string, string>
}

export function getUpgradesAvailable({
  learnedForgeRecipes,
  toolLevels,
}: GetUpgradesAvailableArgs): farmhand.upgradesMetadatum[] {
  let upgradesAvailable: farmhand.upgradesMetadatum[] = []

  const typedToolUpgrades = (toolUpgrades as unknown) as Record<
    string,
    Record<string, farmhand.upgradesMetadatum>
  >

  for (let type of Object.keys(typedToolUpgrades)) {
    const upgrade = typedToolUpgrades[type][toolLevels[type]]

    if (upgrade && !upgrade.isMaxLevel && upgrade.nextLevel) {
      const nextLevelUpgrade = typedToolUpgrades[type][upgrade.nextLevel]

      if (!nextLevelUpgrade) {
        continue
      }

      let allIngredientsUnlocked = true

      if (nextLevelUpgrade.ingredients) {
        for (let ingredient of Object.keys(nextLevelUpgrade.ingredients)) {
          allIngredientsUnlocked =
            allIngredientsUnlocked &&
            !!(
              !recipesMap[ingredient] ||
              learnedForgeRecipes.includes(ingredient)
            )
        }
      }

      if (allIngredientsUnlocked) {
        upgradesAvailable.push(nextLevelUpgrade)
      }
    }
  }

  return upgradesAvailable
}
