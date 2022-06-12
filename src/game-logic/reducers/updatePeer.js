import { MAX_LATEST_PEER_MESSAGES } from '../../constants'

/**
 * @param {farmhand.state} state
 * @param {string} peerId The peer to update
 * @param {Object} state
 * @returns {farmhand.state}
 */
export const updatePeer = (state, peerId, peerState) => {
  const peers = { ...state.peers }
  peers[peerId] = peerState

  // Out of date peer clients may not provide pendingPeerMessages, so default
  // it here.
  const { pendingPeerMessages = [] } = peerState

  return {
    ...state,
    peers,
    latestPeerMessages: [
      ...pendingPeerMessages,
      ...state.latestPeerMessages,
    ].slice(0, MAX_LATEST_PEER_MESSAGES),
  }
}
