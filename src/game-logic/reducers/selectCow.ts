export const selectCow = (state: farmhand.state, { id }): farmhand.state => ({
  ...state,
  selectedCowId: id,
})
