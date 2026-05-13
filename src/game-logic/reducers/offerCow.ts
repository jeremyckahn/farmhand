export const offerCow = (
  state: farmhand.state,
  cowId: string
): farmhand.state => {
  state = { ...state, cowIdOfferedForTrade: cowId }

  return state
}
