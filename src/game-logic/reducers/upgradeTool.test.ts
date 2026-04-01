import { EXPERIENCE_VALUES } from '../../constants.js'
import { itemType, toolLevel, toolType } from '../../enums.js'
import { testState } from '../../test-utils/index.js'
import upgrades from '../../data/upgrades.js'

import { upgradeTool } from './upgradeTool.js'

describe('upgradeTool', () => {
  let state

  beforeEach(() => {
    state = testState({
      inventory: [
        { id: 'bronze-ingot', quantity: 20 },
        { id: 'coal', quantity: 50 },
      ],
      toolLevels: {
        [toolType.HOE]: toolLevel.DEFAULT,
        [toolType.SCYTHE]: toolLevel.DEFAULT,
        [toolType.SHOVEL]: toolLevel.DEFAULT,
        [toolType.WATERING_CAN]: toolLevel.DEFAULT,
      },
      experience: 0,
    })
  })

  describe('validation', () => {
    test('returns state unchanged when upgrade lacks toolType', () => {
      const upgrade = {
        id: 'test',
        name: 'Test',
        level: toolLevel.BRONZE,
        type: itemType.TOOL_UPGRADE,
        value: 0,
        doesPriceFluctuate: false,
      }
      const result = upgradeTool(state, upgrade)
      expect(result).toBe(state)
    })

    test('returns state unchanged when upgrade lacks level', () => {
      const upgrade = {
        id: 'test',
        name: 'Test',
        toolType: toolType.HOE,
        type: itemType.TOOL_UPGRADE,
        value: 0,
        doesPriceFluctuate: false,
      }
      const result = upgradeTool(state, upgrade)
      expect(result).toBe(state)
    })

    test('returns state unchanged when player lacks sufficient ingredients', () => {
      const upgrade = upgrades[toolType.HOE][toolLevel.BRONZE]
      const stateWithoutIngredients = testState({
        inventory: [],
        toolLevels: {
          [toolType.HOE]: toolLevel.DEFAULT,
          [toolType.SCYTHE]: toolLevel.DEFAULT,
          [toolType.SHOVEL]: toolLevel.DEFAULT,
          [toolType.WATERING_CAN]: toolLevel.DEFAULT,
        },
      })

      const result = upgradeTool(stateWithoutIngredients, upgrade)
      expect(result).toBe(stateWithoutIngredients)
    })

    test('returns state unchanged when player has insufficient quantity of ingredients', () => {
      const upgrade = upgrades[toolType.HOE][toolLevel.BRONZE]
      const stateWithInsufficientIngredients = testState({
        inventory: [
          { id: 'bronze-ingot', quantity: 1 }, // needs 8
          { id: 'coal', quantity: 1 }, // needs 16
        ],
        toolLevels: {
          [toolType.HOE]: toolLevel.DEFAULT,
          [toolType.SCYTHE]: toolLevel.DEFAULT,
          [toolType.SHOVEL]: toolLevel.DEFAULT,
          [toolType.WATERING_CAN]: toolLevel.DEFAULT,
        },
      })

      const result = upgradeTool(stateWithInsufficientIngredients, upgrade)
      expect(result).toBe(stateWithInsufficientIngredients)
    })
  })

  describe('successful upgrade', () => {
    test('upgrades tool level', () => {
      const upgrade = upgrades[toolType.HOE][toolLevel.BRONZE]
      const result = upgradeTool(state, upgrade)

      expect(result.toolLevels[toolType.HOE]).toBe(toolLevel.BRONZE)
    })

    test('decrements ingredients from inventory', () => {
      const upgrade = upgrades[toolType.HOE][toolLevel.BRONZE]
      const result = upgradeTool(state, upgrade)

      const bronzeIngotItem = result.inventory.find(
        item => item.id === 'bronze-ingot'
      )
      const coalItem = result.inventory.find(item => item.id === 'coal')

      expect(bronzeIngotItem?.quantity).toBe(12) // 20 - 8
      expect(coalItem?.quantity).toBe(34) // 50 - 16
    })

    test('adds experience for tool upgrade', () => {
      const upgrade = upgrades[toolType.HOE][toolLevel.BRONZE]
      const result = upgradeTool(state, upgrade)

      expect(result.experience).toBe(EXPERIENCE_VALUES.FORGE_RECIPE_MADE)
    })

    test('shows notification', () => {
      const upgrade = upgrades[toolType.HOE][toolLevel.BRONZE]
      const result = upgradeTool(state, upgrade)

      expect(result.latestNotification).toBeDefined()
      expect(result.latestNotification?.message).toContain('Basic Hoe')
      expect(result.latestNotification?.message).toContain('Bronze Hoe')
    })

    test('handles upgrade with no ingredients', () => {
      // Create a mock upgrade with no ingredients
      const upgradeWithoutIngredients = {
        id: 'test-upgrade',
        toolType: toolType.HOE,
        level: toolLevel.BRONZE,
        name: 'Test Upgrade',
        type: itemType.TOOL_UPGRADE,
        value: 0,
        doesPriceFluctuate: false,
      }

      const result = upgradeTool(state, upgradeWithoutIngredients)

      expect(result.toolLevels[toolType.HOE]).toBe(toolLevel.BRONZE)
      expect(result.experience).toBe(EXPERIENCE_VALUES.FORGE_RECIPE_MADE)
      expect(result.inventory).toEqual(state.inventory) // inventory unchanged
    })

    test('adds upgrade to inventory', () => {
      const upgrade = upgrades[toolType.HOE][toolLevel.BRONZE]
      const result = upgradeTool(state, upgrade)

      const upgradeInInventory = result.inventory.find(
        item => item.id === upgrade.id
      )
      expect(upgradeInInventory).toBeDefined()
      expect(upgradeInInventory?.quantity).toBe(1)
    })
  })

  describe('different tool types', () => {
    test('upgrades scythe correctly', () => {
      const upgrade = upgrades[toolType.SCYTHE][toolLevel.BRONZE]
      const result = upgradeTool(state, upgrade)

      expect(result.toolLevels[toolType.SCYTHE]).toBe(toolLevel.BRONZE)
      expect(result.toolLevels[toolType.HOE]).toBe(toolLevel.DEFAULT) // other tools unchanged
    })

    test('upgrades shovel correctly', () => {
      const upgrade = upgrades[toolType.SHOVEL][toolLevel.BRONZE]
      const result = upgradeTool(state, upgrade)

      expect(result.toolLevels[toolType.SHOVEL]).toBe(toolLevel.BRONZE)
      expect(result.toolLevels[toolType.HOE]).toBe(toolLevel.DEFAULT) // other tools unchanged
    })
  })

  describe('multiple upgrades', () => {
    test('can upgrade same tool multiple times', () => {
      const bronzeUpgrade = upgrades[toolType.HOE][toolLevel.BRONZE]
      const stateAfterBronze = upgradeTool(state, bronzeUpgrade)

      // Add more ingredients for iron upgrade
      const stateWithMoreIngredients = {
        ...stateAfterBronze,
        inventory: [
          ...stateAfterBronze.inventory,
          { id: 'iron-ingot', quantity: 10 },
          { id: 'coal', quantity: 50 }, // Add more coal for iron upgrade
        ],
        toolLevels: {
          ...stateAfterBronze.toolLevels,
          [toolType.HOE]: toolLevel.BRONZE,
        },
      }

      const ironUpgrade = upgrades[toolType.HOE][toolLevel.IRON]
      const result = upgradeTool(stateWithMoreIngredients, ironUpgrade)

      expect(result.toolLevels[toolType.HOE]).toBe(toolLevel.IRON)
    })
  })
})
