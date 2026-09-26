import { randomStream } from '../enums.js'

import { chooseRandomIndex } from './chooseRandomIndex.js'

export const chooseRandom = <T>(list: T[], stream?: randomStream): T =>
  list[chooseRandomIndex(list, stream)]
