// TODO: Add tests for this reducer
/**

 * @param peerId The peer to add

 */
export const addPeer = (state: any, peerId: string): any => {
  const peers = { ...state.peers }
  peers[peerId] = null

  return { ...state, peers, activePlayers: (state.activePlayers ?? 1) + 1 }
}
