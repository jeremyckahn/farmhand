import { random } from '../common/utils.js'
import { randomStream } from '../enums.js'

export const chooseRandomIndex = <T>(
  list: T[],
  stream?: randomStream
): number =>
  // TODO: Fix statistical bias by using Math.floor(random() * list.length).
  Math.round(random(stream) * (list.length - 1))
