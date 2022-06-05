import { MAX_PENDING_PEER_MESSAGES } from '../../constants'

import { prependPendingPeerMessage } from './prependPendingPeerMessage'

describe('prependPendingPeerMessage', () => {
  test('prepends a message', () => {
    const { pendingPeerMessages } = prependPendingPeerMessage(
      { id: 'abc123', pendingPeerMessages: [] },
      'hello world'
    )

    expect(pendingPeerMessages).toEqual([
      { id: 'abc123', message: 'hello world', severity: 'info' },
    ])
  })

  test('limits the amount of stored messages', () => {
    const { pendingPeerMessages } = prependPendingPeerMessage(
      {
        id: 'abc123',
        pendingPeerMessages: new Array(50).fill({
          id: 'abc123',
          message: 'some other message',
          severity: 'info',
        }),
      },
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
