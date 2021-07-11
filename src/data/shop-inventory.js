import {
  // Plantable crops
  asparagusSeed,
  carrotSeed,
  cornSeed,
  jalapenoSeed,
  onionSeed,
  peaSeed,
  potatoSeed,
  pumpkinSeed,
  soybeanSeed,
  spinachSeed,
  strawberrySeed,
  tomatoSeed,
  watermelonSeed,
  wheatSeed,

  // Field items
  fertilizer,
  scarecrow,
  sprinkler,
} from './items'

const inventory = [
  // Plantable crops
  asparagusSeed,
  carrotSeed,
  cornSeed,
  jalapenoSeed,
  onionSeed,
  peaSeed,
  potatoSeed,
  pumpkinSeed,
  soybeanSeed,
  spinachSeed,
  strawberrySeed,
  tomatoSeed,
  watermelonSeed,
  wheatSeed,

  // Field items
  fertilizer,
  scarecrow,
  sprinkler,
]

export default inventory

export const itemIds = new Set(inventory.map(item => item.id))
