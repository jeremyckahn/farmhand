import { MAX_PENDING_PEER_MESSAGES } from '../../constants.js'

/**


 * @param [severity='info']

 */
export const prependPendingPeerMessage = (
  state: any,
  message: string,
  severity?: any = 'info'
): any => {
  return {
    ...state,
    pendingPeerMessages: [
      { playerId: state.playerId, message, severity },
      ...state.pendingPeerMessages,
    ].slice(0, MAX_PENDING_PEER_MESSAGES),
  }
}
