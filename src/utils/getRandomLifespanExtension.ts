import { random } from '../common/utils.js'

import { getTreeDeathChance } from './getTreeDeathChance.js'

// A generous safety cap purely to guarantee termination - in practice the
// loop below resolves almost immediately (getTreeDeathChance caps at
// TREE_DEATH_CHANCE_MAX well before this many iterations).
const MAX_ITERATIONS = 1000

// Simulates "roll dice every day, with rising odds, starting the moment a
// tree passes its (possibly early-shortened) lifespan floor" - but does it
// all at once, at plant time, rather than spread across real calendar
// days. This is what keeps the result save-scum-proof: the whole
// simulation happens inside one reducer call, and its outcome is
// committed to state immediately, rather than being re-rolled on a later,
// separate day's processing.
export const getRandomLifespanExtension = (): number => {
  let daysPastLifespan = 0

  while (
    daysPastLifespan < MAX_ITERATIONS &&
    random() >= getTreeDeathChance(daysPastLifespan)
  ) {
    daysPastLifespan++
  }

  return daysPastLifespan
}
