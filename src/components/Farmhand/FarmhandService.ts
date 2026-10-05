import { itemsMap } from '../../data/maps.js'
import { fieldMode, itemType } from '../../enums.js'
import { getItemCurrentValue } from '../../utils/getItemCurrentValue.js'
import { memoize } from '../../utils/memoize.js'

const { PLANT } = fieldMode
const { MULCH } = itemType

const getItemOrThrow = (id: string): farmhand.item => {
  const item = itemsMap[id as keyof typeof itemsMap]

  if (!item) {
    throw new Error(`Inventory references unknown item id: ${id}`)
  }

  return item
}

export class FarmhandService {
  static computePlayerInventory = memoize(
    (
      inventory: farmhand.state['inventory'],
      valueAdjustments: Record<string, number>
    ): farmhand.item[] =>
      inventory.map(({ quantity, id }: { quantity: number; id: string }) => {
        const item = getItemOrThrow(id)

        return {
          quantity,
          ...item,
          value: getItemCurrentValue(item, valueAdjustments),
        }
      })
  )

  static getFieldToolInventory = memoize(
    (inventory: farmhand.state['inventory']): farmhand.item[] =>
      inventory
        .filter(({ id }: { id: string }) => {
          const item = getItemOrThrow(id)

          return (
            typeof item.enablesFieldMode === 'string' &&
            item.enablesFieldMode !== PLANT &&
            // Mulch is Forest-only - it must never show up in the Field's
            // toolbelt even though it shares the FERTILIZE field mode with
            // fertilizer (see getMulchInventory).
            item.type !== MULCH
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
        .filter(({ id }: { id: string }) => getItemOrThrow(id).isPlantableCrop)
        .map(({ id, quantity }: { id: string; quantity: number }) => ({
          ...itemsMap[id as keyof typeof itemsMap],
          quantity,
        }))
  )

  static getMulchInventory = memoize(
    (inventory: farmhand.state['inventory']): farmhand.item[] =>
      inventory
        .filter(({ id }: { id: string }) => {
          const item = itemsMap[id as keyof typeof itemsMap]

          return item?.type === MULCH
        })
        .map(({ id, quantity }: { id: string; quantity: number }) => ({
          ...itemsMap[id as keyof typeof itemsMap],
          quantity,
        }))
  )

  static getPlantableTreeInventory = memoize(
    (inventory: farmhand.state['inventory']): farmhand.item[] =>
      inventory
        .filter(({ id }: { id: string }) => {
          const item = itemsMap[id as keyof typeof itemsMap]

          return item?.isPlantableTree
        })
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
