import { toDecimal, dinero, USD } from 'dinero.js'

import { itemsMap } from '../data/maps.js'

import { getItemBaseValue } from './getItemBaseValue.js'

export const getItemCurrentValue = (
  { id }: farmhand.item,
  valueAdjustments: Record<string, number>
): number => {
  const amount = Math.round(
    (valueAdjustments[id]
      ? getItemBaseValue(id) *
        (itemsMap[id].doesPriceFluctuate ? valueAdjustments[id] : 1)
      : getItemBaseValue(id)) * 100
  )

  return Number(toDecimal(dinero({ amount, currency: USD })))
}
