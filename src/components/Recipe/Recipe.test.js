import React from 'react'
import { shallow } from 'enzyme'

import Recipe from './Recipe'

let component

beforeEach(() => {
  component = shallow(
    <Recipe
      {...{
        recipe: {},
        inventory: [],
        inventoryLimit: -1,
        playerInventoryQuantities: {},
      }}
    />
  )
})

test('renders', () => {
  expect(component).toHaveLength(1)
})
