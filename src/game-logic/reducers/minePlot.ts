import { toolType, fertilizerType } from '../../enums.js'
import { chooseRandom, doesInventorySpaceRemain } from '../../utils/index.js'
import { INVENTORY_FULL_NOTIFICATION } from '../../strings.js'
import { ResourceFactory } from '../../factories/index.js'
import { random } from '../../common/utils.js'

import { addItemToInventory } from './addItemToInventory.js'
import { showNotification } from './showNotification.js'
import { modifyFieldPlotAt } from './modifyFieldPlotAt.js'

const daysUntilClearPeriods = [1, 2, 2, 3]

export const minePlot = (
  state: farmhand.state,
  x: number,
  y: number
): farmhand.state => {
  const { field } = state
  const row = field[y]

  if (row[x]) {
    // Something is already planted in field[x][y]
    return state
  }

  if (!doesInventorySpaceRemain(state)) {
    return showNotification(state, INVENTORY_FULL_NOTIFICATION)
  }

  const shovelLevel = state.toolLevels[toolType.SHOVEL]
  const factory = (ResourceFactory.instance() as unknown) as {
    generateResources: (l: number) => farmhand.item[]
  }
  const spawnedResources = factory.generateResources(shovelLevel as any)
  const [spawnedResource] = spawnedResources
  let daysUntilClear = chooseRandom(daysUntilClearPeriods)

  if (spawnedResource) {
    const spawnChances = spawnedResources
      .map(({ spawnChance }) => spawnChance)
      .filter(chance => chance != null)
    const minSpawnChance = Math.min(...spawnChances)

    // if a resource was spawned, add up to 10 days to the time to clear at
    // random, based loosely on the minimum spawnChance meant to make rarer
    // resources take longer to cooldown
    daysUntilClear += Math.round(random() * (1 - minSpawnChance) * 10)
  }

  for (let resource of spawnedResources) {
    state = addItemToInventory(state, resource)
  }

  state = modifyFieldPlotAt(state, x, y, () => {
    return {
      itemId: '',
      fertilizerType: fertilizerType.NONE,
      isShoveled: true,
      daysUntilClear,
      oreId: spawnedResource?.id ?? null,
    }
  })

  return {
    ...state,
  }
}
