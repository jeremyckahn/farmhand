import { coal, stone } from '../data/ores'
import { COAL_SPAWN_CHANCE } from '../constants'

export default class StoneFactory {
  generate() {
    let diceRoll = Math.random()
    let resources = []

    resources.push(this.spawnStone())

    if (diceRoll <= COAL_SPAWN_CHANCE) {
      resources.push(this.spawnCoal())
    }

    return resources
  }

  spawnStone() {
    return stone
  }

  spawnCoal() {
    return coal
  }
}
