/**
 * @typedef {import('../../').farmhand.item} farmhand.item
 * @typedef {import('../../').farmhand.levelEntitlements} farmhand.levelEntitlements
 * @typedef {import('./Farmhand.js').farmhand.state} farmhand.state
 */
import { createContext } from 'react'

// eslint-disable-next-line no-unused-vars
import uiEventHandlers from '../../handlers/ui-events.js'

/**
 * @type {import('react').Context<{
 *   gameState: farmhand.state & {
 *     blockInput: boolean,
 *     features: Record<string, boolean>,
 *     fieldToolInventory: farmhand.item[],
 *     isChatAvailable: boolean,
 *     levelEntitlements: farmhand.levelEntitlements,
 *     plantableCropInventory: farmhand.item[],
 *     playerInventory: farmhand.item[],
 *     playerInventoryQuantities: Record<string, number>,
 *     shopInventory: farmhand.item[],
 *     viewList: string[],
 *     viewTitle: string,
 *   }
 *   handlers: uiEventHandlers & { debounced: uiEventHandlers }
 * }>}
 */
// @ts-expect-error
const FarmhandContext = createContext({
  gameState: {},
  handlers: {},
})

export default FarmhandContext
