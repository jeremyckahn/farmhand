/** @typedef {import("../index").farmhand.item} farmhand.item */
import { goldOre, ironOre, bronzeOre, silverOre } from '../data/ores'
import { Factory } from '../interfaces/Factory'
import { randomChoice } from '../utils'

const SPAWNABLE_ORES = [goldOre, ironOre, bronzeOre, silverOre]

/**
 * Resource factory used for spawning ores
 * @constructor
 */
export default class OreFactory extends Factory {
  constructor() {
    super()

    this.oreOptions = []
    for (let o of SPAWNABLE_ORES) {
      this.oreOptions.push({
        ore: o,
        weight: o.spawnChance,
      })
    }
  }

  /**
   * Generate resources
   * @returns {Array.<farmhand.item>} an array of ore resources
   */
  generate() {
    return [this.spawn()]
  }

  /**
   * Spawn a random ore
   * @returns {Object} an object representing an ore
   * @private
   **/
  spawn() {
    const spawnedOption = randomChoice(this.oreOptions)
    return spawnedOption.ore
  }
}
