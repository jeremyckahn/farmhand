import * as ores from '../data/ores'
import { ORE_SPAWN_CHANCE } from '../constants'

export default class OreFactory {
  /*
   * @function spawn
   * @memberof OreFactory
   * @yields {object?} an object representing ore, or null if none was spawned
   * @static
   **/
  static spawn() {
    let shouldSpawnOre = Math.random() < ORE_SPAWN_CHANCE

    if (!shouldSpawnOre) return null

    let diceRoll = Math.random()
    let potentialOres = []
    let ore

    for (let key in ores) {
      ore = ores[key]
      if (diceRoll <= ore.spawnChance) {
        potentialOres.push(ore)
      }
    }

    if (potentialOres.length === 0) return null

    return potentialOres[Math.floor(Math.random() * potentialOres.length)]
  }
}
