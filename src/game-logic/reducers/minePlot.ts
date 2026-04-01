import { toolType, fertilizerType } from '../../enums.ts'
import { chooseRandom, doesInventorySpaceRemain } from '../../utils/index.tsx'
import { INVENTORY_FULL_NOTIFICATION } from '../../strings.ts'
import { ResourceFactory } from '../../factories/index.ts'
import { random } from '../../common/utils.ts'

import { addItemToInventory } from './addItemToInventory.ts'
import { showNotification } from './showNotification.ts'
import { modifyFieldPlotAt } from './modifyFieldPlotAt.ts'

const daysUntilClearPeriods = [1, 2, 2, 3]

/**
 * @param {farmhand.state} state
 * @param {number} x
 * @param {number} y
 * @returns {farmhand.state}
 */
export const minePlot = (state, x, y) => {
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
  // @ts-expect-error
  const spawnedResources = ResourceFactory.instance().generateResources(
    shovelLevel
  )
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
