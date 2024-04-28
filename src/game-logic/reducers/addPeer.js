/**
 * @typedef {import('../../components/Farmhand/Farmhand').farmhand.state} farmhand.state
 */

// TODO: Add tests for this reducer
/**
 * @param {farmhand.state} state
 * @param {string} peerId The peer to add
 * @returns {farmhand.state}
 */
export const addPeer = (state, peerId) => {
  const peers = { ...state.peers }
  peers[peerId] = null

  return { ...state, peers, activePlayers: (state.activePlayers ?? 1) + 1 }
}
