import React from 'react'
import { render, screen } from '@testing-library/react'

import { INFINITE_STORAGE_LIMIT } from '../../constants.js'
import { itemType } from '../../enums.js'
import { noop } from '../../utils/noop.js'

import FarmhandContext, {
  createContextData,
} from '../Farmhand/Farmhand.context.js'

import Shop from './Shop.js'

// The Saplings tab only ever has content when the Forest feature is on
// (see data/shop-inventory.ts) - force it on so tests can populate the
// sample sapling item below.
vitest.mock('../../config.js', () => ({ features: { FOREST: true } }))

const baseGameState = {
  inventoryLimit: INFINITE_STORAGE_LIMIT,

  money: 0,
  purchasedCombine: 0,
  purchasedCowPen: 0,
  purchasedCellar: 0,
  purchasedSmelter: 0,
  purchasedField: 0,
  shopInventory: [] as farmhand.item[],
  valueAdjustments: {},
}

const baseHandlers = {
  handleCombinePurchase: noop,
  handleCowPenPurchase: noop,
  handleCellarPurchase: noop,
  handleFieldPurchase: noop,
  handleStorageExpansionPurchase: noop,
}

const renderShop = (gameStateOverrides: Partial<typeof baseGameState> = {}) => {
  const contextValue = createContextData()

  contextValue.gameState = {
    ...contextValue.gameState,
    ...baseGameState,
    ...gameStateOverrides,
  }
  contextValue.handlers = { ...contextValue.handlers, ...baseHandlers }

  render(
    <FarmhandContext.Provider value={contextValue}>
      <Shop />
    </FarmhandContext.Provider>
  )
}

describe('<Shop />', () => {
  describe('without any saplings in the shop inventory', () => {
    beforeEach(() => {
      renderShop()
    })

    test.each(['Seeds', 'Supplies', 'Upgrades'])(
      'the %s tab exists',
      (tabLabel: string) => {
        expect(screen.getByText(tabLabel)).toBeInTheDocument()
      }
    )

    test('the Saplings tab does not exist', () => {
      expect(screen.queryByText('Saplings')).not.toBeInTheDocument()
    })
  })

  describe('with a sapling in the shop inventory', () => {
    beforeEach(() => {
      renderShop({
        shopInventory: [
          {
            id: 'sample-sapling',
            name: 'Sample Sapling',
            type: itemType.TREE,
            isPlantableTree: true,
          } as farmhand.item,
        ],
      })
    })

    test.each(['Seeds', 'Saplings', 'Supplies', 'Upgrades'])(
      'the %s tab exists',
      (tabLabel: string) => {
        expect(screen.getByText(tabLabel)).toBeInTheDocument()
      }
    )
  })
})
