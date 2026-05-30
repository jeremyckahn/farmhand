export const updateInventoryRecordsForNextDay = (
  state: farmhand.state
): farmhand.state => ({
  ...state,
  todaysPurchases: {},
  todaysStartingInventory: state.inventory.reduce(
    (acc: Record<string, number>, { id, quantity }) => {
      acc[id] = quantity
      return acc
    },
    {}
  ),
})
