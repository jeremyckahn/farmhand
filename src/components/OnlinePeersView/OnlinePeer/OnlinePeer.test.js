import React from 'react'
import { shallow } from 'enzyme'

import OnlinePeer from './OnlinePeer'

let component

beforeEach(() => {
  component = shallow(
    <OnlinePeer
      {...{
        peer: {
          dayCount: 0,
          id: '',
          experience: 1,
          money: 0,
        },
      }}
    />
  )
})

test('renders', () => {
  expect(component).toHaveLength(1)
})
