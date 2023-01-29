import { MAX_PENDING_PEER_MESSAGES } from '../../constants'

/**
 * @param {farmhand.state} state
 * @param {string} peerMessage
 * @param {string?} [severity='info']
 * @returns {farmhand.state}
 */
export const prependPendingPeerMessage = (
  state,
  message,
  severity = 'info'
) => {
  return {
    ...state,
    pendingPeerMessages: [
      { playerId: state.playerId, message, severity },
      ...state.pendingPeerMessages,
    ].slice(0, MAX_PENDING_PEER_MESSAGES),
  }
}
