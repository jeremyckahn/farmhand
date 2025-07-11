import { MAX_PENDING_PEER_MESSAGES } from '../../constants.js'

/**
 * @param {farmhand.state} state
 * @param {string} message
 * @param {farmhand.notificationSeverity} [severity='info']
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
      { id: state.id, message, severity },
      ...state.pendingPeerMessages,
    ].slice(0, MAX_PENDING_PEER_MESSAGES),
  }
}
