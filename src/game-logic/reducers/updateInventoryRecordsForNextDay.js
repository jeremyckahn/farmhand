/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const updateInventoryRecordsForNextDay = state => ({
  ...state,
  todaysPurchases: {},
  todaysStartingInventory: state.inventory.reduce((acc, { playerId, quantity }) => {
    acc[playerId] = quantity
    return acc
  }, {}),
})
