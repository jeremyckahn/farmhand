import { getCowValue } from './getCowValue.js'

export const getCowSellValue = (cow: farmhand.cow) => getCowValue(cow, true)
