import React from 'react'
import { render, screen } from '@testing-library/react'

import { INFINITE_STORAGE_LIMIT } from '../../constants.js'
import { noop } from '../../utils/noop.js'

import FarmhandContext from '../Farmhand/Farmhand.context.js'

import Shop from './Shop.js'

beforeEach(() => {
  const gameState = {
    inventoryLimit: INFINITE_STORAGE_LIMIT,
    levelEntitlements: {
      stageFocusType: {},
    },
    money: 0,
    purchasedCombine: 0,
    purchasedCowPen: 0,
    purchasedCellar: 0,
    purchasedSmelter: 0,
    purchasedField: 0,
    shopInventory: [],
    toolLevels: {},
    valueAdjustments: {},
  }

  const handlers = {
    handleCombinePurchase: noop,
    handleCowPenPurchase: noop,
    handleCellarPurchase: noop,
    handleFieldPurchase: noop,
    handleStorageExpansionPurchase: noop,
  }

  render(
    <FarmhandContext.Provider value={{ gameState, handlers }}>
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
