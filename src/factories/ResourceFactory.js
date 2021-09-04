import { itemType } from '../enums'
import {
  RESOURCE_SPAWN_CHANCE,
  ORE_SPAWN_CHANCE,
  COAL_SPAWN_CHANCE,
  STONE_SPAWN_CHANCE,
} from '../constants'

import OreFactory from './OreFactory'
import CoalFactory from './CoalFactory'
import StoneFactory from './StoneFactory'

const factoryForItemType = type => {
  switch (type) {
    case itemType.STONE:
      return StoneFactory

    case itemType.FUEL:
      return CoalFactory

    case itemType.ORE:
      return OreFactory

    default:
      return null
  }
}

export default class ResourceFactory {
  static generate() {
    let diceRoll = Math.random()

    if (diceRoll <= RESOURCE_SPAWN_CHANCE) {
      diceRoll = Math.random()

      if (diceRoll <= ORE_SPAWN_CHANCE) {
        return OreFactory.generate()
      } else if (diceRoll <= COAL_SPAWN_CHANCE) {
        return CoalFactory.generate(StoneFactory)
      } else if (diceRoll <= STONE_SPAWN_CHANCE) {
        return StoneFactory.generate(CoalFactory)
      }
    }

    return null
  }

  static spawn(typeToSpawn) {
    let factory = factoryForItemType(typeToSpawn)

    if (!factory) return null

    return factory.spawn()
  }
}
