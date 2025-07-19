import React from 'react'
import { shallow } from 'enzyme'

import OnlinePeer from './OnlinePeer.js'

let component

beforeEach(() => {
  component = shallow(
    <OnlinePeer
      {...{
        peer: {
          cowOfferedForTrade: null,
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
