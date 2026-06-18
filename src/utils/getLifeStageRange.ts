import { cropLifeStage } from '../enums.js'

import { memoize } from './memoize.js'

const { SEED, GROWING, GROWN } = cropLifeStage

export const getLifeStageRange = memoize((cropTimeline: number[]) => {
  let lifeStageRange = Array(cropTimeline[0]).fill(SEED)

  lifeStageRange = lifeStageRange.concat(
    cropTimeline
      .slice(1)
      .reduce(
        (acc: Array<string | number>, value) =>
          acc.concat(Array(value).fill(GROWING)),
        []
      )
  )

  return lifeStageRange
}, {})
