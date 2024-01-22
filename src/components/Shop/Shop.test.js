import React from 'react'
import { shallow } from 'enzyme'

import Inventory from '../Inventory'
import { INFINITE_STORAGE_LIMIT } from '../../constants'
import { noop } from '../../utils/noop'

import { Shop } from './Shop'

let component

beforeEach(() => {
  component = shallow(
    <Shop
      {...{
        handleCombinePurchase: noop,
        handleCowPenPurchase: noop,
        handleCellarPurchase: noop,
        handleFieldPurchase: noop,
        handleStorageExpansionPurchase: noop,
        inventoryLimit: INFINITE_STORAGE_LIMIT,
        money: 0,
        purchasedCombine: 0,
        purchasedCowPen: 0,
        purchasedCellar: 0,
        purchasedSmelter: 0,
        purchasedField: 0,
        shopInventory: [],
        stagesUnlocked: {},
        toolLevels: {},
        valueAdjustments: {},
      }}
    />
  )
})

test('renders shop inventory', () => {
  expect(component.find(Inventory)).toHaveLength(2)
})
