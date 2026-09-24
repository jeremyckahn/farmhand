import { random } from '../common/utils.js'

export const chooseRandomIndex = <T>(list: T[], stream?: string): number =>
  // TODO: Fix statistical bias by using Math.floor(random() * list.length).
  Math.round(random(stream) * (list.length - 1))
