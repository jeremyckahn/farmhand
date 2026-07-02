import { itemsMap } from '../../data/maps.js'
import { fieldMode } from '../../enums.js'
import { getItemCurrentValue } from '../../utils/getItemCurrentValue.js'
import { memoize } from '../../utils/memoize.js'

const { PLANT } = fieldMode

export class FarmhandService {
  static computePlayerInventory = memoize(
    (
      inventory: farmhand.state['inventory'],
      valueAdjustments: Record<string, number>
    ): farmhand.item[] =>
      // TODO: Add a defensive check if itemsMap[id] is undefined to prevent runtime crash on invalid items
      inventory.map(({ quantity, id }: { quantity: number; id: string }) => ({
        quantity,
        ...itemsMap[id as keyof typeof itemsMap],
        value: getItemCurrentValue(
          itemsMap[id as keyof typeof itemsMap],
          valueAdjustments
        ),
      }))
  )

  static getFieldToolInventory = memoize(
    (inventory: farmhand.state['inventory']): farmhand.item[] =>
      inventory
        .filter(({ id }: { id: string }) => {
          // TODO: Defensive check if item exists in itemsMap to prevent crashes on undefined itemsMap[id]
          const { enablesFieldMode } = itemsMap[id as keyof typeof itemsMap]

          return (
            typeof enablesFieldMode === 'string' && enablesFieldMode !== PLANT
          )
        })
        .map(({ id, quantity }: { id: string; quantity: number }) => ({
          ...itemsMap[id as keyof typeof itemsMap],
          quantity,
        }))
  )

  static getPlantableCropInventory = memoize(
    (inventory: farmhand.state['inventory']): farmhand.item[] =>
      inventory
        .filter(
          ({ id }: { id: string }) =>
            // TODO: Add a defensive check to verify itemsMap[id] exists before accessing isPlantableCrop
            itemsMap[id as keyof typeof itemsMap].isPlantableCrop
        )
        .map(({ id, quantity }: { id: string; quantity: number }) => ({
          ...itemsMap[id as keyof typeof itemsMap],
          quantity,
        }))
  )

  static applyPriceEvents = (
    valueAdjustments: Record<string, number>,
    priceCrashes: Partial<Record<string, globalThis.farmhand.priceEvent>>,
    priceSurges: Partial<Record<string, globalThis.farmhand.priceEvent>>
  ): Record<string, number> => {
    const patchedValueAdjustments = { ...valueAdjustments }

    Object.keys(priceCrashes).forEach(itemId => {
      patchedValueAdjustments[itemId] = 0.5
    })
    Object.keys(priceSurges).forEach(itemId => {
      patchedValueAdjustments[itemId] = 1.5
    })

    return patchedValueAdjustments
  }
}
