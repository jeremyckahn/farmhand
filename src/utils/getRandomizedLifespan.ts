import { random } from '../common/utils.js'
import { TREE_LIFESPAN_VARIANCE_MAX } from '../constants.js'

import { getRandomLifespanExtension } from './getRandomLifespanExtension.js'

export const getRandomizedLifespan = (defaultLifespan: number): number => {
  // Up to TREE_LIFESPAN_VARIANCE_MAX percent short of the default - e.g.
  // a 200-day default can floor as low as 190 days (5% short).
  const earlyDeathFloor =
    defaultLifespan * (1 - random() * TREE_LIFESPAN_VARIANCE_MAX)

  return Math.round(earlyDeathFloor + getRandomLifespanExtension())
}
