import React from 'react'
import { shallow } from 'enzyme'

import OnlinePeersView from './OnlinePeersView.js'

let component

beforeEach(() => {
  component = shallow(
    <OnlinePeersView
      {...{
        activePlayers: 0,
        cowIdOfferedForTrade: '',
        cowInventory: [],
        id: '',
        latestPeerMessages: [],
        peers: {},
      }}
    />
  )
})

test('renders', () => {
  expect(component).toHaveLength(1)
})
