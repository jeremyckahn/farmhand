import React from 'react'
import { shallow } from 'enzyme'

import { noop } from '../../utils/noop.js'

import QuickSelect from './QuickSelect.js'

let component

beforeEach(() => {
  component = shallow(
    <QuickSelect
      {...{
        fieldToolInventory: [],
        handleItemSelectClick: noop,
        playerInventoryQuantities: {},
        plantableCropInventory: [],
        selectedItemId: '',
      }}
    />
  )
})

test('renders', () => {
  expect(component).toHaveLength(1)
})
