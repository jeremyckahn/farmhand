import { fieldMode, itemType } from '../enums.js'
import { getCropLifecycleDuration } from '../utils/getCropLifecycleDuration.js'

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
  id = '',
  name = '',
  ...rest
}) =>
  freeze(
    /** @type {farmhand.item} */ ({
      id,
      name,
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
  )

/**
 * @param {farmhand.item} item
 * @param {Object} [config]
 * @param {number} [config.variantIdx]
 * @param {boolean} [config.canBeFermented]
 * @returns {farmhand.item}
 */
export const fromSeed = (
  { cropTimeline, cropType, growsInto, tier = 1 },
  { variantIdx = 0, canBeFermented = false } = {}
) => {
  const variants = Array.isArray(growsInto) ? growsInto : [growsInto]

  return /** @type {farmhand.item} */ ({
    id: variants[variantIdx] || '',
    cropTimeline,
    cropType,
    doesPriceFluctuate: true,
    tier,
    type: itemType.CROP,
    ...(canBeFermented && {
      daysToFerment: getCropLifecycleDuration({ cropTimeline }) * tier,
    }),
  })
}

/**
 * @param {farmhand.cropVariety} cropVariety
 * @returns {farmhand.cropVariety}
 */
export const cropVariety = ({
  imageId,
  cropFamily,
  variety,
  ...cropVarietyProperties
}) => {
  return { imageId, cropFamily, variety, ...crop({ ...cropVarietyProperties }) }
}
