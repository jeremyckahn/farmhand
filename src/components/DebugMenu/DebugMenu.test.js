import React from 'react'
import { shallow } from 'enzyme'

import { noop } from '../../utils/noop.js'

import { DebugMenu } from './DebugMenu.js'

let component

beforeEach(() => {
  component = shallow(
    <DebugMenu
      {...{
        handleAddMoneyClick: noop,
        handleItemPurchaseClick: noop,
      }}
    />
  )
})

test('renders Debug', () => {
  expect(component).toHaveLength(1)
})
