import React from 'react'
import { shallow } from 'enzyme'

import { noop } from '../../utils/noop'

import { DebugMenu } from './DebugMenu'

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
