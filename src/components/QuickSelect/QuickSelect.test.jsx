import React from 'react'
import { shallow } from 'enzyme'

import { noop } from '../../utils/noop'

import QuickSelect from './QuickSelect'

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
