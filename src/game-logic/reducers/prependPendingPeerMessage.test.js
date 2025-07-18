import { MAX_PENDING_PEER_MESSAGES } from '../../constants.js'
import { testState } from '../../test-utils/index.js'

import { prependPendingPeerMessage } from './prependPendingPeerMessage.js'

describe('prependPendingPeerMessage', () => {
  test('prepends a message', () => {
    const { pendingPeerMessages } = prependPendingPeerMessage(
      testState({ id: 'abc123', pendingPeerMessages: [] }),
      'hello world'
    )

    expect(pendingPeerMessages).toEqual([
      { id: 'abc123', message: 'hello world', severity: 'info' },
    ])
  })

  test('limits the amount of stored messages', () => {
    const { pendingPeerMessages } = prependPendingPeerMessage(
      testState({
        id: 'abc123',
        pendingPeerMessages: new Array(50).fill({
          id: 'abc123',
          message: 'some other message',
          severity: 'info',
        }),
      }),
      'hello world'
    )

    expect(pendingPeerMessages[0]).toEqual({
      id: 'abc123',
      message: 'hello world',
      severity: 'info',
    })

    expect(pendingPeerMessages).toHaveLength(MAX_PENDING_PEER_MESSAGES)
  })
})
