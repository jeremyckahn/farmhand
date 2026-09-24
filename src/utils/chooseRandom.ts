import { chooseRandomIndex } from './chooseRandomIndex.js'

export const chooseRandom = <T>(list: T[], stream?: string): T =>
  list[chooseRandomIndex(list, stream)]
