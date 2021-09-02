import * as ores from '../data/ores'

export default class OreFactory {
  /*
   * @function spawn
   * @memberof OreFactory
   * @yields {object?} an object representing ore, or null if none was spawned
   * @static
   **/
  static spawn() {
    var diceRoll = Math.random()
    var potentialOres = []
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
