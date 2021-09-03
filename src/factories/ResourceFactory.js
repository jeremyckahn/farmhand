import { coal, stone } from '../data/ores'
import { itemType } from '../enums'
import {
  COAL_WITH_STONE_SPAWN_CHANCE,
  RESOURCE_SPAWN_CHANCE,
  ORE_SPAWN_CHANCE,
  COAL_SPAWN_CHANCE,
  STONE_SPAWN_CHANCE,
} from '../constants'

import OreFactory from './OreFactory'

/*
 * TODO: break this file up or bring OreFactory in (probably break up...)
 **/

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

export class ResourceFactory {
  static generate() {
    let diceRoll = Math.random()

    if (diceRoll <= RESOURCE_SPAWN_CHANCE) {
      diceRoll = Math.random()

      if (diceRoll <= ORE_SPAWN_CHANCE) {
        return OreFactory.generate()
      } else if (diceRoll <= COAL_SPAWN_CHANCE) {
        return CoalFactory.generate()
      } else if (diceRoll <= STONE_SPAWN_CHANCE) {
        return StoneFactory.generate()
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

export class CoalFactory {
  static generate() {
    const diceRoll = Math.random()
    let spawns = []

    if (diceRoll <= coal.spawnChance) {
      const amount = Math.round(Math.random() * 3) + 1

      for (let i = 0; i < amount; i++) {
        spawns.push(CoalFactory.spawn(), StoneFactory.spawn())
      }
    }

    return spawns
  }

  static spawn() {
    return coal
  }
}

export class StoneFactory {
  static generate() {
    const diceRoll = Math.random()
    let resources = []

    if (diceRoll <= stone.spawnChance) {
      resources.push(StoneFactory.spawn())

      if (diceRoll <= COAL_WITH_STONE_SPAWN_CHANCE) {
        resources.push(CoalFactory.spawn())
      }
    }

    return resources
  }

  static spawn() {
    return stone
  }
}
