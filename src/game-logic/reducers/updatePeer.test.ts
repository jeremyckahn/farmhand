import Farmhand from '../../components/Farmhand/index.ts'
import { MAX_LATEST_PEER_MESSAGES } from '../../constants.ts'
import { NEW_COW_OFFERED_FOR_TRADE } from '../../templates.ts'
import { getCowStub } from '../../test-utils/stubs/cowStub.ts'
import { getPeerMetadataStub } from '../../test-utils/stubs/peerMetadataStub.ts'
import { testState } from '../../test-utils/index.ts'

import { updatePeer } from './updatePeer.ts'

const stubPeerMetadata = getPeerMetadataStub()

describe('updatePeer', () => {
  test('updates peer data', () => {
    const { latestPeerMessages, peers } = updatePeer(
      testState({
        latestPeerMessages: [],
        peers: { abc123: stubPeerMetadata },
      }),
      Farmhand,
      { foo: false },
      'abc123'
    )

    expect(latestPeerMessages).toEqual([])
    expect(peers).toEqual({ abc123: { foo: false } })
  })

  test('limits pendingPeerMessages', () => {
    const { latestPeerMessages } = updatePeer(
      testState({
        latestPeerMessages: new Array(50).fill('message'),
        peers: { abc123: stubPeerMetadata },
      }),
      Farmhand,
      { foo: false },
      'abc123'
    )

    expect(latestPeerMessages).toHaveLength(MAX_LATEST_PEER_MESSAGES)
  })

  test('shows a notification when a new cow is offered', () => {
    const { todaysNotifications } = updatePeer(
      testState({
        latestPeerMessages: [],
        todaysNotifications: [],
        peers: {
          abc123: stubPeerMetadata,
        },
      }),
      Farmhand,
      { ...stubPeerMetadata, cowOfferedForTrade: getCowStub() },
      'abc123'
    )

    expect(todaysNotifications[0]).toEqual(
      expect.objectContaining({
        message: NEW_COW_OFFERED_FOR_TRADE`${stubPeerMetadata}`,
      })
    )
  })

  test('does not show a notification when a cow is rescinded', () => {
    const { todaysNotifications } = updatePeer(
      testState({
        latestPeerMessages: [],
        todaysNotifications: [],
        peers: {
          abc123: { ...stubPeerMetadata, cowOfferedForTrade: getCowStub() },
        },
      }),
      Farmhand,
      stubPeerMetadata,
      'abc123'
    )

    expect(todaysNotifications).toEqual([])
  })
})
