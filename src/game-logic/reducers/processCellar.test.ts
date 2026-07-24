import { testState } from '../../test-utils/index.js'
import { carrot, garlic } from '../../data/items.js'
import { wineChardonnay } from '../../data/recipes.js'
import { KEGS_READY_TO_SELL } from '../../templates.js'

import { processCellar } from './processCellar.js'

describe('processCellar', () => {
  test('kegs are updated', () => {
    const expectedState = processCellar(
      testState({
        cellarInventory: [
          { itemId: carrot.id, daysUntilMature: 4, id: 'carrot-id' },
          { itemId: garlic.id, daysUntilMature: 0, id: 'garlic-id' },
        ],
      })
    )

    expect(expectedState).toEqual(
      testState({
        cellarInventory: [
          { itemId: carrot.id, daysUntilMature: 3, id: 'carrot-id' },
          { itemId: garlic.id, daysUntilMature: -1, id: 'garlic-id' },
        ],
      })
    )
  })

  test('notifies when a wine keg becomes ready', () => {
    const result = processCellar(
      testState({
        cellarInventory: [
          { itemId: wineChardonnay.id, daysUntilMature: 1, id: 'wine-id' },
        ],
      })
    )

    expect(result.newDayNotifications).toEqual([
      {
        message: KEGS_READY_TO_SELL('', {
          [wineChardonnay.name]: 1,
        }),
        severity: 'success',
      },
    ])
  })

  test('does not notify for a fermented crop keg becoming ready', () => {
    const result = processCellar(
      testState({
        cellarInventory: [
          { itemId: carrot.id, daysUntilMature: 1, id: 'carrot-id' },
        ],
      })
    )

    expect(result.newDayNotifications).toEqual([])
  })

  test('does not notify for a keg that is already ready or not yet ready', () => {
    const result = processCellar(
      testState({
        cellarInventory: [
          { itemId: carrot.id, daysUntilMature: 4, id: 'carrot-id' },
          { itemId: garlic.id, daysUntilMature: 0, id: 'garlic-id' },
        ],
      })
    )

    expect(result.newDayNotifications).toEqual([])
  })

  test('does not re-notify for a wine keg that is already ready', () => {
    const result = processCellar(
      testState({
        cellarInventory: [
          { itemId: wineChardonnay.id, daysUntilMature: 0, id: 'wine-id' },
        ],
      })
    )

    expect(result.newDayNotifications).toEqual([])
  })

  test('does not notify for a wine keg that is not yet ready', () => {
    const result = processCellar(
      testState({
        cellarInventory: [
          { itemId: wineChardonnay.id, daysUntilMature: 5, id: 'wine-id' },
        ],
      })
    )

    expect(result.newDayNotifications).toEqual([])
  })
})
