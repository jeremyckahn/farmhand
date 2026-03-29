/**
 * @param {farmhand.state} state
 * @param {string} cowId
 * @returns {farmhand.state}
 */
export const offerCow = (state, cowId) => {
  state = { ...state, cowIdOfferedForTrade: cowId }

  return state
}
