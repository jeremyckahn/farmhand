import { getCostOfNextStorageExpansion } from '../../utils/getCostOfNextStorageExpansion.js'
import { moneyTotal } from '../../utils/moneyTotal.js'
import {
  INFINITE_STORAGE_LIMIT,
  STORAGE_EXPANSION_AMOUNT,
} from '../../constants.js'

export const purchaseStorageExpansion = (
  state: farmhand.state
): farmhand.state => {
  const { money, inventoryLimit } = state
  const storageUpgradeCost = getCostOfNextStorageExpansion(inventoryLimit)

  if (money < storageUpgradeCost || inventoryLimit === INFINITE_STORAGE_LIMIT) {
    return state
  }

  return {
    ...state,
    inventoryLimit: inventoryLimit + STORAGE_EXPANSION_AMOUNT,
    money: moneyTotal(money, -storageUpgradeCost),
  }
}
