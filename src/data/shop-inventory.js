import {
  // Plantable crops
  asparagusSeed,
  carrotSeed,
  cornSeed,
  jalapenoSeed,
  onionSeed,
  potatoSeed,
  pumpkinSeed,
  soybeanSeed,
  spinachSeed,
  tomatoSeed,
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
  potatoSeed,
  pumpkinSeed,
  soybeanSeed,
  spinachSeed,
  tomatoSeed,
  wheatSeed,

  // Field items
  fertilizer,
  scarecrow,
  sprinkler,
]

export default inventory

export const itemIds = new Set(inventory.map(item => item.id))
