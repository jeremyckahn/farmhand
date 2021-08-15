import { bronzeOre } from './bronzeOre'
import { goldOre } from './goldOre'
import { ironOre } from './ironOre'
import { silverOre } from './silverOre'
import { stone } from './stone'

export { bronzeOre, goldOre, ironOre, silverOre, stone }

const ores = [bronzeOre, goldOre, ironOre, silverOre, stone].sort(
  o => o.spawnChance
)

export function oreSpawner(value) {
  var oreToSpawn = null

  for (let ore of ores) {
    if (value < ore.spawnChance) {
      oreToSpawn = ore
      break
    }
  }

  return oreToSpawn
}
