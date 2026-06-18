import { memoize } from './memoize.js'
import { getInventoryQuantityMap } from './getInventoryQuantityMap.js'

export const maxYieldOfRecipe = memoize(
  (
    { ingredients }: farmhand.recipe,
    inventory: Array<{ id: string; quantity: number }>
  ) => {
    const inventoryQuantityMap = getInventoryQuantityMap(inventory)

    return (
      Math.min(
        ...Object.keys(ingredients).map(itemId =>
          Math.floor(inventoryQuantityMap[itemId] / ingredients[itemId])
        )
      ) || 0
    )
  },
  {}
)
