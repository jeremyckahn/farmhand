/**
 * @param state
 * @param cowId
 * @returns {farmhand.state}
 */
export const withdrawCow = (state, cowId) => {
  const { cowIdOfferedForTrade } = state

  if (cowId === cowIdOfferedForTrade) {
    state = { ...state, cowIdOfferedForTrade: '' }
  }

  return state
}
