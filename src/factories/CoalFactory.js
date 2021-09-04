import { coal } from '../data/ores'

export default class CoalFactory {
  static generate(stoneFactory) {
    const diceRoll = Math.random()
    let spawns = []

    if (diceRoll <= coal.spawnChance) {
      const amount = Math.round(Math.random() * 3) + 1

      for (let i = 0; i < amount; i++) {
        spawns.push(CoalFactory.spawn(), stoneFactory.spawn())
      }
    }

    return spawns
  }

  static spawn() {
    return coal
  }
}
