import { itemsMap } from '../data/maps.js'

import { getLevelEntitlements } from './getLevelEntitlements.js'
import { chooseRandom } from './chooseRandom.js'
import { filterItemIdsToSeeds } from './filterItemIdsToSeeds.js'

export const getRandomLevelUpReward = (level: number): farmhand.item =>
  itemsMap[
    chooseRandom(
      filterItemIdsToSeeds(Object.keys(getLevelEntitlements(level).items))
    )
  ]
