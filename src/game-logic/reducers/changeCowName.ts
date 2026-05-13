import { MAX_ANIMAL_NAME_LENGTH } from '../../constants.js'

import { modifyCow } from './modifyCow.js'

export const changeCowName = (
  state: farmhand.state,
  cowId: string,
  newName: string
): farmhand.state =>
  modifyCow(state, cowId, () => ({
    name: newName.slice(0, MAX_ANIMAL_NAME_LENGTH),
  }))
