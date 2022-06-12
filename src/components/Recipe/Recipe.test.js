import React from 'react'
import { shallow } from 'enzyme'

import Recipe from './Recipe'
import { INFINITE_STORAGE_LIMIT } from "../../constants";

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
