import { toolType } from '../../enums'
import { chooseRandom, doesInventorySpaceRemain } from '../../utils'
import { INVENTORY_FULL_NOTIFICATION } from '../../strings'
import { ResourceFactory } from '../../factories'
import { random } from '../../common/utils'

import { addItemToInventory } from './addItemToInventory'
import { showNotification } from './showNotification'
import { modifyFieldPlotAt } from './modifyFieldPlotAt'

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
  const spawnedResources = ResourceFactory.instance().generateResources(
    shovelLevel
  )
  const [spawnedResource] = spawnedResources
  let daysUntilClear = chooseRandom(daysUntilClearPeriods)

  if (spawnedResource) {
    const spawnChances = spawnedResources.map(({ spawnChance }) => spawnChance)
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
      isShoveled: true,
      daysUntilClear,
      oreId: spawnedResource?.id ?? null,
    }
  })

  return {
    ...state,
  }
}
