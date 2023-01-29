import React from 'react'
import { shallow } from 'enzyme'

import OnlinePeersView from './OnlinePeersView'

let component

beforeEach(() => {
  component = shallow(
    <OnlinePeersView
      {...{
        activePlayers: 0,
        cowIdOfferedForTrade: '',
        cowInventory: [],
        playerId: '',
        latestPeerMessages: [],
        peers: {},
      }}
    />
  )
})

test('renders', () => {
  expect(component).toHaveLength(1)
})
