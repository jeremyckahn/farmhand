import Farmhand from '../../components/Farmhand'
import { MAX_LATEST_PEER_MESSAGES } from '../../constants'

import { updatePeer } from './updatePeer'

describe('updatePeer', () => {
  test('updates peer data', () => {
    const { latestPeerMessages, peers } = updatePeer(
      {
        latestPeerMessages: [],
        peers: { abc123: { foo: true } },
      },
      Farmhand,
      { foo: false },
      'abc123'
    )

    expect(latestPeerMessages).toEqual([])
    expect(peers).toEqual({ abc123: { foo: false } })
  })

  test('limits pendingPeerMessages', () => {
    const { latestPeerMessages } = updatePeer(
      {
        latestPeerMessages: new Array(50).fill('message'),
        peers: { abc123: { foo: true } },
      },
      Farmhand,
      { foo: false },
      'abc123'
    )

    expect(latestPeerMessages).toHaveLength(MAX_LATEST_PEER_MESSAGES)
  })
})
