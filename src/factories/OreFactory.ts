import { goldOre, ironOre, bronzeOre, silverOre } from '../data/ores/index.js'
import { Factory } from '../interfaces/Factory.js'
import { randomChoice } from '../utils/index.js'

const SPAWNABLE_ORES = [goldOre, ironOre, bronzeOre, silverOre]

/**
 * Resource factory used for spawning ores
 * @constructor
 */
export default class OreFactory extends Factory {
  oreOptions: Array<{ ore: typeof SPAWNABLE_ORES[number]; weight: number }> = []

  constructor() {
    super()

    for (let o of SPAWNABLE_ORES) {
      this.oreOptions.push({
        ore: o,
        weight: o.spawnChance || 0,
      })
    }
  }

  /**
   * Generate resources
   * @returns an array of ore resources
   */
  generate(): any {
    return [this.spawn()]
  }

  /**
   * Spawn a random ore
   * @returns an object representing an ore
   * @private
   **/
  spawn(): Object {
    const spawnedOption = randomChoice(this.oreOptions)
    return spawnedOption.ore
  }
}
