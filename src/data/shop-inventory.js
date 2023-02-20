import {
  // Plantable crops
  asparagusSeed,
  carrotSeed,
  cornSeed,
  grapeSeed,
  garlicSeed,
  jalapenoSeed,
  oliveSeed,
  onionSeed,
  peaSeed,
  potatoSeed,
  pumpkinSeed,
  soybeanSeed,
  spinachSeed,
  sunflowerSeed,
  strawberrySeed,
  sweetPotatoSeed,
  tomatoSeed,
  watermelonSeed,
  wheatSeed,

  // Field items
  scarecrow,
  sprinkler,
} from './items'

import { fertilizer } from './recipes'

const inventory = [
  // Plantable crops
  asparagusSeed,
  carrotSeed,
  cornSeed,
  grapeSeed,
  garlicSeed,
  jalapenoSeed,
  oliveSeed,
  onionSeed,
  peaSeed,
  potatoSeed,
  pumpkinSeed,
  soybeanSeed,
  spinachSeed,
  sunflowerSeed,
  strawberrySeed,
  sweetPotatoSeed,
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
