import { goldOre, ironOre, bronzeOre, silverOre } from '../data/ores'
import { randomChoice } from '../common/utils'

const SPAWNABLE_ORES = [goldOre, ironOre, bronzeOre, silverOre]

export default class OreFactory {
  constructor() {
    this.oreOptions = []
    for (let o of SPAWNABLE_ORES) {
      this.oreOptions.push({
        ore: o,
        weight: o.spawnChance,
      })
    }
  }

  /*
   * @function spawn
   * @yields {object} an object representing ore, or null if none was spawned
   **/
  spawn() {
    const spawnedOption = randomChoice(this.oreOptions)
    return spawnedOption.ore
  }

  /*
   * @function generate
   * @yields {array} an array containing ores
   **/
  generate() {
    return [this.spawn()]
  }
}
