// TODO: Add tests for this reducer
/**
 * @param state
 * @param peerId The peer to add
 * @returns {farmhand.state}
 */
export const addPeer = (state, peerId) => {
  const peers = { ...state.peers }
  peers[peerId] = null

  return { ...state, peers, activePlayers: (state.activePlayers ?? 1) + 1 }
}
