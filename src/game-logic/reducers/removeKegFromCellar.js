/**
 * @param {farmhand.state} state
 * @param {string} kegId
 */
export const removeKegFromCellar = (state, kegId) => {
  const { cellarInventory } = state

  const kegIdx = cellarInventory.findIndex(({ id }) => {
    return id === kegId
  })

  if (kegIdx === -1) {
    console.error(`removeKegFromCellar: kegId ${kegId} not found`)
    return state
  }

  const newCellarInventory = [
    ...cellarInventory.slice(0, kegIdx),
    ...cellarInventory.slice(kegIdx + 1, cellarInventory.length),
  ]

  state = { ...state, cellarInventory: newCellarInventory }

  return state
}
