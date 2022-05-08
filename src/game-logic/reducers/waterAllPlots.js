import { waterField } from './waterField'

// TODO: Remove this and just use waterField directly.
/**
 * @param {farmhand.state} state
 * @returns {farmhand.state}
 */
export const waterAllPlots = state => waterField(state)
