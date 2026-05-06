import { MAX_ANIMAL_NAME_LENGTH } from '../../constants.js'

import { modifyCow } from './modifyCow.js'


export const changeCowName = (state: any, cowId: string, newName: string): any =>
  modifyCow(state, cowId, () => ({
    name: newName.slice(0, MAX_ANIMAL_NAME_LENGTH),
  }))
