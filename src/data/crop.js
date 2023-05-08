/** @typedef {import("../index").farmhand.item} farmhand.item */

import { fieldMode, itemType } from '../enums'

const { freeze } = Object

/**
 * @param {farmhand.item} item
 * @returns {farmhand.item}
 */
export const crop = ({
  cropTimetable,
  growsInto,
  tier,

  isSeed = Boolean(growsInto),
  cropLifecycleDuration = Object.values(cropTimetable).reduce(
    (acc, value) => acc + value,
    0
  ),

  ...rest
}) =>
  freeze({
    cropTimetable,
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
 * @returns {farmhand.item}
 */
export const fromSeed = (
  { cropTimetable, cropType, growsInto, tier },
  { variantIdx = 0 } = {}
) => {
  const variants = Array.isArray(growsInto) ? growsInto : [growsInto]

  return {
    cropTimetable,
    cropType,
    doesPriceFluctuate: true,
    id: variants[variantIdx],
    tier,
    type: itemType.CROP,
  }
}
