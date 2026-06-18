import {
  INITIAL_STORAGE_LIMIT,
  STORAGE_EXPANSION_AMOUNT,
  STORAGE_EXPANSION_BASE_PRICE,
  STORAGE_EXPANSION_SCALE_PREMIUM,
} from '../constants.js'

export const getCostOfNextStorageExpansion = (
  currentInventoryLimit: number
): number => {
  const upgradesPurchased =
    (currentInventoryLimit - INITIAL_STORAGE_LIMIT) / STORAGE_EXPANSION_AMOUNT

  return (
    STORAGE_EXPANSION_BASE_PRICE +
    upgradesPurchased * STORAGE_EXPANSION_SCALE_PREMIUM
  )
}
