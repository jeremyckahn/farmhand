/**
 * @typedef {import("../index").farmhand.item} farmhand.item
 * @typedef {import("../index").farmhand.cropVariety} farmhand.cropVariety
 */

import { fieldMode, itemType } from '../enums'
import { getCropLifecycleDuration } from '../utils/getCropLifecycleDuration'

const { freeze } = Object

/**
 * @param {Partial<farmhand.item>} item
 * @returns {farmhand.item}
 */
export const crop = ({
  cropTimeline,
  growsInto,
  tier = 1,

  isSeed = Boolean(growsInto),
  cropLifecycleDuration = getCropLifecycleDuration({ cropTimeline }),

  ...rest
}) =>
  freeze({
    cropTimeline,
    doesPriceFluctuate: true,
    tier,
    type: itemType.CROP,
    value: 10 + cropLifecycleDuration * tier * (isSeed ? 1 : 3),
    ...(isSeed && {
      enablesFieldMode: fieldMode.PLANT,
      growsInto,
      isPlantableCrop: true,
    }),
    ...rest,
  })

/**
 * @param {farmhand.item} item
 * @param {Object} [config]
 * @param {number} [config.variantIdx]
 * @param {boolean} [config.canBeFermented]
 * @returns {farmhand.item}
 */
export const fromSeed = (
  { cropTimeline, cropType, growsInto, tier },
  { variantIdx = 0, canBeFermented = false } = {}
) => {
  const variants = Array.isArray(growsInto) ? growsInto : [growsInto]

  return {
    cropTimeline,
    cropType,
    doesPriceFluctuate: true,
    id: variants[variantIdx],
    tier,
    type: itemType.CROP,
    ...(canBeFermented && {
      daysToFerment: getCropLifecycleDuration({ cropTimeline }) * tier,
    }),
  }
}

/**
 * @param {farmhand.cropVariety} cropVariety
 * @returns {farmhand.cropVariety}
 */
export const cropVariety = ({
  imageId,
  cropFamily,
  ...cropVarietyProperties
}) => {
  return { imageId, cropFamily, ...crop({ ...cropVarietyProperties }) }
}
