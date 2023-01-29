import { COW_ATTRITION_MESSAGE } from '../../templates'
import {
  COW_WEIGHT_MULTIPLIER_MINIMUM,
  INFINITE_STORAGE_LIMIT,
} from '../../constants'
import { huggingMachine } from '../../data/items'
import { generateCow } from '../../utils'

import { processCowAttrition } from './processCowAttrition'

describe('processCowAttrition', () => {
  test('unfed cows leave', () => {
    const unfedCow = generateCow({
      name: 'unfed cow',
      weightMultiplier: COW_WEIGHT_MULTIPLIER_MINIMUM,
    })
    const fedCow = generateCow({ name: 'fed cow', weightMultiplier: 1 })

    const { cowInventory, newDayNotifications } = processCowAttrition({
      cowBreedingPen: { cowId1: null, cowId2: null, daysUntilBirth: -1 },
      cowInventory: [unfedCow, fedCow],
      inventory: [],
      newDayNotifications: [],
    })

    expect(cowInventory).toEqual([fedCow])
    expect(newDayNotifications).toEqual([
      { message: COW_ATTRITION_MESSAGE`${unfedCow}`, severity: 'error' },
    ])
  })

  test('used hugging machines are returned to inventory', () => {
    const unfedCow = generateCow({
      name: 'unfed cow',
      weightMultiplier: COW_WEIGHT_MULTIPLIER_MINIMUM,
    })
    const unfedCowWithHuggingMachine = generateCow({
      name: 'unfed cow',
      weightMultiplier: COW_WEIGHT_MULTIPLIER_MINIMUM,
      isUsingHuggingMachine: true,
    })

    const { cowInventory, inventory } = processCowAttrition({
      cowBreedingPen: { cowId1: null, cowId2: null, daysUntilBirth: -1 },
      cowInventory: [unfedCow, unfedCowWithHuggingMachine],
      inventory: [],
      inventoryLimit: INFINITE_STORAGE_LIMIT,
      newDayNotifications: [],
    })

    expect(cowInventory).toEqual([])
    expect(inventory).toEqual([{ playerId: huggingMachine.playerId, quantity: 1 }])
  })
})
