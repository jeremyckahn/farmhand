export const findCowById = (
  cowInventory: Array<farmhand.cow>,
  id: string
): farmhand.cow | undefined => cowInventory.find(cow => id === cow.id)
