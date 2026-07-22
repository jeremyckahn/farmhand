import { PURCHASEABLE_CELLARS } from '../../constants.js'
import { cellarService } from '../../services/cellar.js'
import { vinegarService } from '../../services/vinegar.js'

import { addKegToCellarInventory } from './addKegToCellarInventory.js'
import { decrementItemFromInventory } from './decrementItemFromInventory.js'

export const makeVinegar = (
  state: farmhand.state,
  recipe: farmhand.vinegar,
  howMany: number = 1
): farmhand.state => {
  const { inventory, cellarInventory, purchasedCellar } = state

  const { space: cellarSize } = PURCHASEABLE_CELLARS.get(purchasedCellar) ?? {
    space: 0,
  }

  const maxYield = vinegarService.getMaxVinegarYield({
    recipe,
    inventory,
    cellarInventory,
    cellarSize,
  })

  const vinegarYield = Math.min(howMany, maxYield)

  for (let i = 0; i < vinegarYield; i++) {
    const keg = cellarService.generateKeg(recipe)

    state = addKegToCellarInventory(state, keg)
  }

  state = Object.keys(recipe.ingredients).reduce(
    (reducerState, ingredientId) =>
      decrementItemFromInventory(
        reducerState,
        ingredientId,
        recipe.ingredients[ingredientId] * vinegarYield
      ),
    state
  )

  return state
}
