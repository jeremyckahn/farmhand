export const withdrawCow = (
  state: farmhand.state,
  cowId: string
): farmhand.state => {
  const { cowIdOfferedForTrade } = state

  if (cowId === cowIdOfferedForTrade) {
    state = { ...state, cowIdOfferedForTrade: '' }
  }

  return state
}
