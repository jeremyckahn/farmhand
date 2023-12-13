import React from 'react'
import { shallow } from 'enzyme'

import { INFINITE_STORAGE_LIMIT } from '../../constants'

import Recipe from './Recipe'

let component

beforeEach(() => {
  component = shallow(
    <Recipe
      {...{
        recipe: {},
        inventory: [],
        inventoryLimit: INFINITE_STORAGE_LIMIT,
        playerInventoryQuantities: {},
      }}
    />
  )
})

test('renders', () => {
  expect(component).toHaveLength(1)
})
