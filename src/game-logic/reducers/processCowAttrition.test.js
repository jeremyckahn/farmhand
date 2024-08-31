import { COW_ATTRITION_MESSAGE } from '../../templates.js'
import {
  COW_WEIGHT_MULTIPLIER_MINIMUM,
  INFINITE_STORAGE_LIMIT,
} from '../../constants.js'
import { huggingMachine } from '../../data/items.js'
import { generateCow } from '../../utils/index.js'

import { processCowAttrition } from './processCowAttrition.js'

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
    expect(inventory).toEqual([{ id: huggingMachine.id, quantity: 1 }])
  })
})
