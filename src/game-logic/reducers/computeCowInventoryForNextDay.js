import { COW_HUG_BENEFIT, MAX_DAILY_COW_HUG_BENEFITS } from '../../constants'

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const computeCowInventoryForNextDay = state => ({
  ...state,
  cowInventory: state.cowInventory.map(cow => ({
    ...cow,
    daysOld: cow.daysOld + 1,
    daysSinceMilking: cow.daysSinceMilking + 1,
    // `cow.daysSinceProducingFertilizer || 0` is needed because legacy cows
    // did not define daysSinceProducingFertilizer.
    daysSinceProducingFertilizer: (cow.daysSinceProducingFertilizer || 0) + 1,
    happiness: Math.max(
      0,
      cow.isUsingHuggingMachine
        ? Math.min(
            1,
            cow.happiness + (MAX_DAILY_COW_HUG_BENEFITS - 1) * COW_HUG_BENEFIT
          )
        : cow.happiness - COW_HUG_BENEFIT
    ),
    happinessBoostsToday: cow.isUsingHuggingMachine
      ? MAX_DAILY_COW_HUG_BENEFITS
      : 0,
  })),
})
