/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */

export const updateInventoryRecordsForNextDay = state => ({
  ...state,
  todaysPurchases: {},
  todaysStartingInventory: state.inventory.reduce((acc, { id, quantity }) => {
    acc[id] = quantity
    return acc
  }, {}),
})
