import { randomNumberService } from '../../common/services/randomNumber.js'
import { goldOre } from '../../data/ores/index.js'
import { ResourceFactory } from '../../factories/index.js'
import { toolType, toolLevel } from '../../enums.js'
import { testState, testCrop } from '../../test-utils/index.js'

import { minePlot } from './minePlot.js'

describe('minePlot', () => {
  let gameState

  beforeAll(() => {
    vitest.spyOn(ResourceFactory, 'instance')
    vitest.spyOn(randomNumberService, 'generateRandomNumber').mockReturnValue(1)

    // @ts-expect-error - Mock function type assertion
    ResourceFactory.instance.mockReturnValue({
      generateResources: () => [goldOre],
    })

    gameState = minePlot(
      testState({
        field: [[null, testCrop()]],
        inventory: [],
        inventoryLimit: 50,
        toolLevels: {
          [toolType.HOE]: toolLevel.DEFAULT,
          [toolType.SCYTHE]: toolLevel.DEFAULT,
          [toolType.SHOVEL]: toolLevel.DEFAULT,
          [toolType.WATERING_CAN]: toolLevel.DEFAULT,
        },
      }),
      0,
      0
    )
  })

  test('updates the plot to be shoveled if the plot is empty', () => {
    expect(gameState.field[0][0].isShoveled).toEqual(true)
  })

  test('sets the oreId on the plot if ore was spawned', () => {
    expect(gameState.field[0][0].oreId).toEqual(goldOre.id)
  })

  test('sets the days until clear', () => {
    expect(gameState.field[0][0].daysUntilClear).toEqual(12)
  })

  test('adds the spawned ore to the inventory', () => {
    let itemIsInInventory = false

    for (let item of gameState.inventory) {
      if (item.id === goldOre.id) {
        itemIsInInventory = true
        break
      }
    }

    expect(itemIsInInventory).toEqual(true)
  })

  test('does not alter the plot if something is already there', () => {
    expect(gameState.field[0][1]).toEqual(testCrop())
  })

  test('shows a notification if there is no room in the inventory', () => {
    gameState.inventoryLimit = 0
    gameState.showNotifications = true
    gameState.todaysNotifications = []
    gameState.field[0][0] = null

    const { latestNotification } = minePlot(gameState, 0, 0)

    expect(latestNotification).toEqual({
      message: 'Your inventory is full!',
      severity: 'info',
    })
  })
})
