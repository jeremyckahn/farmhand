import { notificationSeverity } from '../../enums.js'
import { MAX_PENDING_PEER_MESSAGES } from '../../constants.js'

export const prependPendingPeerMessage = (
  state: farmhand.state,
  message: string,
  severity: notificationSeverity = 'info'
): farmhand.state => {
  return {
    ...state,
    pendingPeerMessages: [
      { playerId: state.playerId, message, severity },
      ...state.pendingPeerMessages,
    ].slice(0, MAX_PENDING_PEER_MESSAGES),
  }
}
