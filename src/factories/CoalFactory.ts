import { coal, stone } from '../data/ores/index.ts'
import { Factory } from '../interfaces/Factory.ts'
import { chooseRandom } from '../utils/index.tsx'

/**
 * Resource factory used for spawning coal
 * @constructor
 */
export default class CoalFactory extends Factory {
  /**
   * Generate resources
   * @returns {Array.<farmhand.item>} an array of coal and stone resources
   */
  generate() {
    let spawns = []

    const amount = chooseRandom([1, 1, 1, 2, 3])

    for (let i = 0; i < amount; i++) {
      // @ts-expect-error
      spawns.push(this.spawnCoal())
    }

    // @ts-expect-error
    spawns.push(this.spawnStone())

    return spawns
  }

  /**
   * Spawn a piece of coal
   * @returns {Object} coal item
   * @private
   */
  spawnCoal() {
    return coal
  }

  /**
   * Spawn a piece of stone
   * @returns {Object} stone item
   * @private
   */
  spawnStone() {
    return stone
  }
}
