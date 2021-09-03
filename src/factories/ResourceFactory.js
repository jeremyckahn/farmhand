import { coal, stone } from '../data/ores'
import { itemType } from '../enums'

export class ResourceFactory {
  static generate() {
    const diceRoll = Math.round(Math.random() * 100) % 6

    if (diceRoll % 2 === 0) {
      return CoalFactory.generate()
    }

    return StoneFactory.generate()
  }

  static spawn(typeToSpawn) {
    let factory = null

    switch (typeToSpawn) {
      case itemType.STONE:
        factory = StoneFactory
        break

      case itemType.FUEL:
        factory = CoalFactory
        break

      default:
        break
    }

    if (factory) {
      return factory.spawn()
    }

    return null
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

    if (diceRoll <= stone.spawnChance) {
      return [StoneFactory.spawn()]
    }

    return []
  }

  static spawn() {
    return stone
  }
}
