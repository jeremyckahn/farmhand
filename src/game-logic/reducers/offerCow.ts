
export const offerCow = (state: any, cowId: string): any => {
  state = { ...state, cowIdOfferedForTrade: cowId }

  return state
}
