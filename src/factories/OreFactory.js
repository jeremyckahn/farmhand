import { goldOre, ironOre, bronzeOre, silverOre } from '../data/ores'
import { ORE_SPAWN_CHANCE } from '../constants'

const SPAWNABLE_ORES = [goldOre, ironOre, bronzeOre, silverOre]

export default class OreFactory {
  /*
   * @function spawn
   * @memberof OreFactory
   * @yields {object?} an object representing ore, or null if none was spawned
   * @static
   **/
  static spawn() {
    let diceRoll = Math.random()
    let potentialOres = []

    for (let ore of SPAWNABLE_ORES) {
      if (diceRoll <= ore.spawnChance) {
        potentialOres.push(ore)
      }
    }

    if (potentialOres.length === 0) return null

    const chosenOre =
      potentialOres[Math.floor(Math.random() * potentialOres.length)]

    return chosenOre
  }

  /*
   * @function generate
   * @memberof OreFactory
   * @yields {array} an array containing 0 or 1 ores
   * @static
   **/
  static generate() {
    const shouldSpawnOre = Math.random() < ORE_SPAWN_CHANCE
    if (!shouldSpawnOre) return null

    const spawnedOre = OreFactory.spawn()

    if (!spawnedOre) return []

    return [spawnedOre]
  }
}
