/**
 * @param state
 * @param cow
 * @returns {farmhand.state}
 */
export const selectCow = (state, { id }) => ({ ...state, selectedCowId: id })
