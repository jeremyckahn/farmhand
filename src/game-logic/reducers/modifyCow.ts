// TODO: Add tests for this reducer
/**
 * @param fn Function that takes a cow and returns the modified cow or undefined.
 */
export const modifyCow = (
  state: farmhand.state,
  cowId: string,
  fn: Function
): farmhand.state => {
  const cowInventory = [...state.cowInventory]

  // TODO: Use the findCowById util here.
  const cow = cowInventory.find(({ id }) => id === cowId)

  if (!cow) {
    return state
  }

  const cowIndex = cowInventory.indexOf(cow)

  if (cowIndex === -1) {
    return state
  }

  cowInventory[cowIndex] = {
    ...cow,
    ...fn(cow),
  }

  return {
    ...state,
    cowInventory,
  }
}
