import { coal, stone } from '../data/ores/index.js'
import { Factory } from '../interfaces/Factory.js'
import { chooseRandom } from '../utils/index.js'

/**
 * Resource factory used for spawning coal
 * @constructor
 */
export default class CoalFactory extends Factory {
  /**
   * Generate resources
   * @returns an array of coal and stone resources
   */
  generate(): farmhand.item[] {
    const spawns: farmhand.item[] = []

    const amount = chooseRandom([1, 1, 1, 2, 3])

    for (let i = 0; i < amount; i++) {
      spawns.push(this.spawnCoal())
    }

    spawns.push(this.spawnStone())

    return spawns
  }

  /**
   * Spawn a piece of coal
   * @returns coal item
   * @private
   */
  spawnCoal(): Object {
    return coal
  }

  /**
   * Spawn a piece of stone
   * @returns stone item
   * @private
   */
  spawnStone(): Object {
    return stone
  }
}
