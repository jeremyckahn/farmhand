/**
 */

// TODO: Add tests for this reducer
/**
 * @param state
 * @param peerId The peer to remove
 * @returns {farmhand.state}
 */
export const removePeer = (state, peerId) => {
  const peers = { ...state.peers }
  delete peers[peerId]

  return { ...state, peers, activePlayers: (state.activePlayers ?? 1) - 1 }
}
