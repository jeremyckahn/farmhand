import React from 'react'
import { shallow } from 'enzyme'

import Inventory from '../Inventory'

import { Shop } from './Shop'

let component

beforeEach(() => {
  component = shallow(
    <Shop
      {...{
        money: 0,
        purchasedCowPen: 0,
        purchasedField: 0,
        shopInventory: [],
        valueAdjustments: {},
      }}
    />
  )
})

test('renders shop inventory', () => {
  expect(component.find(Inventory)).toHaveLength(1)
})
