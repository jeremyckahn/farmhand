import { MAX_ANIMAL_NAME_LENGTH } from '../../constants.js'

import { modifyCow } from './modifyCow.js'

/**
 * @param state
 * @param newName
 * @param cowId
 * @returns {farmhand.state}
 */
export const changeCowName = (state, cowId, newName) =>
  modifyCow(state, cowId, () => ({
    name: newName.slice(0, MAX_ANIMAL_NAME_LENGTH),
  }))
