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
  type,
  value,
  ...rest
}) =>
  freeze(
    /** @type {farmhand.item} */ ({
      cropTimeline,
      doesPriceFluctuate: true,
      tier,
      type: type || itemType.CROP,
      value:
        value ||
        10 +
          getCropLifecycleDuration({ cropTimeline }) *
            tier *
            (Boolean(growsInto) ? 1 : 3),
      ...(Boolean(growsInto) && {
        isSeed: true,
        enablesFieldMode: fieldMode.PLANT,
        growsInto,
        isPlantableCrop: true,
      }),
      ...rest,
    })
  )

/**
 * @param {farmhand.seedItem} item
 * @param {Object} [config]
 * @param {number} [config.variantIdx]
 * @param {boolean} [config.canBeFermented]
 * @returns {Partial<farmhand.item>}
 */
export const fromSeed = (
  { cropTimeline, cropType, growsInto, tier = 1 },
  { variantIdx = 0, canBeFermented = false } = {}
) => {
  const variants = Array.isArray(growsInto) ? growsInto : [growsInto]

  return {
    id: variants[variantIdx],
    cropTimeline,
    cropType,
    tier,
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
  variety,
  ...cropVarietyProperties
}) => {
  return {
    imageId,
    cropFamily,
    variety,
    ...crop(/** @type {farmhand.item} */ ({ ...cropVarietyProperties })),
  }
}
