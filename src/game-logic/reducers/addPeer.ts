// TODO: Add tests for this reducer
/**
 * @param peerId The peer to add
 */
export const addPeer = (
  state: farmhand.state,
  peerId: string
): farmhand.state => {
  const peers = { ...state.peers }
  peers[peerId] = null

  return { ...state, peers, activePlayers: (state.activePlayers ?? 1) + 1 }
}
