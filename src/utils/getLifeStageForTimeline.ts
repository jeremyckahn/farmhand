import { cropLifeStage } from '../enums.js'

import { getLifeStageRange } from './getLifeStageRange.js'

const { GROWN } = cropLifeStage

export const getLifeStageForTimeline = (
  timeline: number[],
  daysElapsed: number
): farmhand.cropLifeStage =>
  getLifeStageRange(timeline)[Math.floor(daysElapsed)] || GROWN
