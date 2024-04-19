/**
 * @typedef {import('../../').farmhand.item} farmhand.item
 * @typedef {import('../../').farmhand.levelEntitlements} farmhand.levelEntitlements
 * @typedef {import('./Farmhand').farmhand.state} farmhand.state
 */
import { createContext } from 'react'

/**
 * @type {import('react').Context<{
 *   gameState: farmhand.state & {
 *    blockInput: boolean,
 *    features: Record<string, boolean>,
 *    fieldToolInventory: farmhand.item[],
 *    isChatAvailable: boolean,
 *    levelEntitlements: farmhand.levelEntitlements,
 *    plantableCropInventory: farmhand.item[],
 *    playerInventory: farmhand.item[],
 *    playerInventoryQuantities: Record<string, number>,
 *    shopInventory: farmhand.item[],
 *    viewList: string[],
 *    viewTitle: string,
 *   }
 *   handlers: {}
 * }>}
 */
// @ts-expect-error
const FarmhandContext = createContext({
  gameState: {},
  handlers: {},
})

export default FarmhandContext
