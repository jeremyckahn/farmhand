import React from 'react'
import { render, screen } from '@testing-library/react'

import { INFINITE_STORAGE_LIMIT } from '../../constants.js'
import { noop } from '../../utils/noop.js'

import FarmhandContext, {
  createContextData,
} from '../Farmhand/Farmhand.context.js'

import Shop from './Shop.js'

beforeEach(() => {
  const gameState = {
    inventoryLimit: INFINITE_STORAGE_LIMIT,

    money: 0,
    purchasedCombine: 0,
    purchasedCowPen: 0,
    purchasedCellar: 0,
    purchasedSmelter: 0,
    purchasedField: 0,
    shopInventory: [],
    valueAdjustments: {},
  }

  const handlers = {
    handleCombinePurchase: noop,
    handleCowPenPurchase: noop,
    handleCellarPurchase: noop,
    handleFieldPurchase: noop,
    handleStorageExpansionPurchase: noop,
  }

  const contextValue = createContextData()
  contextValue.gameState = { ...contextValue.gameState, ...gameState }
  contextValue.handlers = { ...contextValue.handlers, ...handlers }

  render(
    <FarmhandContext.Provider value={contextValue}>
      <Shop />
    </FarmhandContext.Provider>
  )
})

describe('<Shop />', () => {
  test.each(['Seeds', 'Supplies', 'Upgrades'])(
    'the %s tab exists',
    tabLabel => {
      expect(screen.getByText(tabLabel)).toBeInTheDocument()
    }
  )
})
