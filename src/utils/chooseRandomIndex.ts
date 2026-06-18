import { random } from '../common/utils.js'

export const chooseRandomIndex = (list: any[]): number =>
  Math.round(random() * (list.length - 1))
