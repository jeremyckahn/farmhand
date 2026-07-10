import { random } from '../common/utils.js'

export const chooseRandomIndex = <T>(list: T[]): number =>
  // TODO: Fix statistical bias by using Math.floor(random() * list.length).
  Math.round(random() * (list.length - 1))
