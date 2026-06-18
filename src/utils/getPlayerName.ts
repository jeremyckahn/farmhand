import { funAnimalName } from 'fun-animal-names'

import { memoize } from './memoize.js'

export const getPlayerName = memoize((playerId: string): string => {
  return funAnimalName(playerId)
})
