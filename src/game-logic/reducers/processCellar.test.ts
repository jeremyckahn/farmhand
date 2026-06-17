import { carrot, garlic } from '../../data/items.js'

import { processCellar } from './processCellar.js'
import { testState } from "../../test-utils/testState.js";

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
})
