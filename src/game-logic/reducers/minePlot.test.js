import { goldOre } from '../../data/ores'
import { ResourceFactory } from '../../factories'
import { toolType, toolLevel } from '../../enums'

import { minePlot } from './minePlot'

describe('minePlot', () => {
  let gameState

  beforeAll(() => {
    gameState = {
      field: [[null, 'crop']],
      inventory: [],
      inventoryLimit: 99,
      toolLevels: {
        [toolType.SHOVEL]: toolLevel.DEFAULT,
      },
    }

    jest.spyOn(ResourceFactory, 'instance')

    ResourceFactory.instance.mockReturnValue({
      generateResources: () => [goldOre],
    })

    gameState = minePlot(gameState, 0, 0)
  })

  test('updates the plot to be shoveled if the plot is empty', () => {
    expect(gameState.field[0][0].isShoveled).toEqual(true)
  })

  test('sets the oreId on the plot if ore was spawned', () => {
    expect(gameState.field[0][0].oreId).toEqual(goldOre.playerId)
  })

  test('sets the days until clear', () => {
    expect(gameState.field[0][0].daysUntilClear > 0).toEqual(true)
  })

  test('adds the spawned ore to the inventory', () => {
    let itemIsInInventory = false

    for (let item of gameState.inventory) {
      if (item.playerId === goldOre.playerId) {
        itemIsInInventory = true
        break
      }
    }

    expect(itemIsInInventory).toEqual(true)
  })

  test('does not alter the plot if something is already there', () => {
    expect(gameState.field[0][1]).toEqual('crop')
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
