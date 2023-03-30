import React from 'react'
import { shallow } from 'enzyme'

import Inventory from '../Inventory'

import { INFINITE_STORAGE_LIMIT } from '../../constants'

import { Shop } from './Shop'

let component

beforeEach(() => {
  component = shallow(
    <Shop
      {...{
        handleCombinePurchase: () => {},
        handleCowPenPurchase: () => {},
        handleFieldPurchase: () => {},
        handleStorageExpansionPurchase: () => {},
        inventoryLimit: INFINITE_STORAGE_LIMIT,
        money: 0,
        purchasedCombine: 0,
        purchasedCowPen: 0,
        purchasedCellar: 0,
        purchasedSmelter: 0,
        purchasedField: 0,
        shopInventory: [],
        toolLevels: {},
        valueAdjustments: {},
      }}
    />
  )
})

test('renders shop inventory', () => {
  expect(component.find(Inventory)).toHaveLength(2)
})
