/**
 * @param {farmhand.state} state
 * @param {number} amount
 * @returns {farmhand.state}
 */
export const addExperience = (state, amount) => {
  return {
    ...state,
    experience: state.experience + amount,
  }
}
