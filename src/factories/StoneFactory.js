import { stone } from '../data/ores'
import { COAL_WITH_STONE_SPAWN_CHANCE } from '../constants'

export default class StoneFactory {
  static generate(coalFactory) {
    let diceRoll = Math.random()
    let resources = []

    if (diceRoll <= stone.spawnChance) {
      resources.push(StoneFactory.spawn())

      diceRoll = Math.random()
      if (diceRoll <= COAL_WITH_STONE_SPAWN_CHANCE) {
        resources.push(coalFactory.spawn())
      }
    }

    return resources
  }

  static spawn() {
    return stone
  }
}
