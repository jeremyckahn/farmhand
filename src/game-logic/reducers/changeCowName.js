import { MAX_ANIMAL_NAME_LENGTH } from '../../constants'

import { modifyCow } from './modifyCow'

/**
 * @param {farmhand.state} state
 * @param {string} newName
 * @param {string} cowId
 * @returns {farmhand.state}
 */
export const changeCowName = (state, cowId, newName) =>
  modifyCow(state, cowId, () => ({
    name: newName.slice(0, MAX_ANIMAL_NAME_LENGTH),
  }))
