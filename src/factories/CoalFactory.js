import { coal, stone } from '../data/ores'

export default class CoalFactory {
  generate() {
    let spawns = []

    const amount = Math.floor(Math.random() * 3) + 1

    for (let i = 0; i < amount; i++) {
      spawns.push(this.spawnCoal(), this.spawnStone())
    }

    return spawns
  }

  spawnCoal() {
    return coal
  }

  spawnStone() {
    return stone
  }
}
