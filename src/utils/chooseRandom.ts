import { chooseRandomIndex } from './chooseRandomIndex.js'

export const chooseRandom = <T>(list: T[]): T => list[chooseRandomIndex(list)]
