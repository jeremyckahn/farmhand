/**
 * @param {farmhand.state} state
 * @param {string} cowId
 * @returns {farmhand.state}
 */
export const withdrawCow = (state, cowId) => {
  const { cowIdOfferedForTrade } = state

  if (cowId === cowIdOfferedForTrade) {
    state = { ...state, cowIdOfferedForTrade: '' }
  }

  return state
}
