/**
 * @typedef {import('./Farmhand').farmhand.state} farmhand.state
 */
import { createContext } from 'react'

/**
 * @type {import('react').Context<{
 *   gameState: farmhand.state
 *   handlers: {}
 * }>}
 */
// @ts-expect-error
const FarmhandContext = createContext({
  gameState: {},
  handlers: {},
})

export default FarmhandContext
