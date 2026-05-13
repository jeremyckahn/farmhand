import { waterField } from './waterField.js'

// TODO: Remove this and just use waterField directly.
export const waterAllPlots = (state: farmhand.state): farmhand.state =>
  waterField(state)
