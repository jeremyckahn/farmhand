import React from 'react'
import { shallow } from 'enzyme'

import { DebugMenu } from './DebugMenu'

let component

beforeEach(() => {
  component = shallow(
    <DebugMenu
      {...{
        handleAddMoneyClick: () => {},
        handleClearPersistedDataClick: () => {},
        handleDownloadDataClick: () => {},
        handleItemPurchaseClick: () => {},
      }}
    />
  )
})

test('renders Debug', () => {
  expect(component).toHaveLength(1)
})
