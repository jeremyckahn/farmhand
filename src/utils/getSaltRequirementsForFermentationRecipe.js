const saltRequirementMultiplier = 2 / 3

/**
 * @param {farmhand.item} fermentationRecipe
 * @returns {number}
 */
export const getSaltRequirementsForFermentationRecipe = fermentationRecipe => {
  const { daysToFerment = 0, tier = 1 } = fermentationRecipe

  return Math.ceil((daysToFerment ?? 0) * saltRequirementMultiplier) * tier
}
