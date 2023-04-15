/** @typedef {import("../index").farmhand.item} farmhand.item */
import { chooseRandom } from '../utils'
import { coal, stone } from '../data/ores'

/**
 * Resource factory used for spawning coal
 * @constructor
 */
export default class CoalFactory {
  /**
   * Generate resources
   * @returns {Array.<farmhand.item>} an array of coal and stone resources
   */
  generate() {
    let spawns = []

    const amount = chooseRandom([1, 1, 1, 2, 3])

    for (let i = 0; i < amount; i++) {
      spawns.push(this.spawnCoal())
    }

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
