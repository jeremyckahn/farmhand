import React from 'react'
import { shallow } from 'enzyme'

import LogView from './LogView'

let component

beforeEach(() => {
  component = shallow(
    <LogView
      {...{
        notificationLog: [],
      }}
    />
  )
})

test('renders', () => {
  expect(component).toHaveLength(1)
})
