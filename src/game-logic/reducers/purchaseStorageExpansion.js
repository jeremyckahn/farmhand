import { getCostOfNextStorageExpansion, moneyTotal } from '../../utils'
import {
  INFINITE_STORAGE_LIMIT,
  STORAGE_EXPANSION_AMOUNT,
} from '../../constants'

/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const purchaseStorageExpansion = state => {
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
