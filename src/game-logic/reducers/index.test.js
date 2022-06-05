import { MAX_PENDING_PEER_MESSAGES } from '../../constants'

import * as fn from './'

jest.mock('../../data/achievements')
jest.mock('../../data/maps')
jest.mock('../../data/items')
jest.mock('../../data/levels', () => ({ levels: [], itemUnlockLevels: {} }))
jest.mock('../../data/recipes')
jest.mock('../../data/shop-inventory')
jest.mock('../../utils/isRandomNumberLessThan')

jest.mock('../../constants', () => ({
  __esModule: true,
  ...jest.requireActual('../../constants'),
  COW_HUG_BENEFIT: 0.5,
  CROW_CHANCE: 0,
  PRECIPITATION_CHANCE: 0,
}))

describe('prependPendingPeerMessage', () => {
  test('prepends a message', () => {
    const { pendingPeerMessages } = fn.prependPendingPeerMessage(
      { id: 'abc123', pendingPeerMessages: [] },
      'hello world'
    )

    expect(pendingPeerMessages).toEqual([
      { id: 'abc123', message: 'hello world', severity: 'info' },
    ])
  })

  test('limits the amount of stored messages', () => {
    const { pendingPeerMessages } = fn.prependPendingPeerMessage(
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
