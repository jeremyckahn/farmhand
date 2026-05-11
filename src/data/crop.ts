import { fieldMode, itemType } from '../enums.js'
import { getCropLifecycleDuration } from '../utils/getCropLifecycleDuration.js'

const { freeze } = Object

interface CropArgs extends Partial<farmhand.item> {
  cropTimeline?: number[]
}

export const crop = ({
  cropTimeline = [],
  growsInto,
  tier = 1,
  isSeed = Boolean(growsInto),
  cropLifecycleDuration = getCropLifecycleDuration({ cropTimeline }),
  id = '',
  name = '',
  ...rest
}: CropArgs): farmhand.item =>
  freeze({
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

interface FromSeedConfig {
  variantIdx?: number
  canBeFermented?: boolean
}

export const fromSeed = (
  { cropTimeline, cropType, growsInto, tier = 1 }: farmhand.item,
  { variantIdx = 0, canBeFermented = false }: FromSeedConfig = {}
): Partial<farmhand.item> => {
  const variants = Array.isArray(growsInto) ? growsInto : [growsInto]

  return {
    id: variants[variantIdx] || '',
    cropTimeline: cropTimeline || [],
    cropType,
    doesPriceFluctuate: true,
    tier,
    type: itemType.CROP,
    ...(canBeFermented &&
      cropTimeline && {
        daysToFerment: getCropLifecycleDuration({ cropTimeline }) * tier,
      }),
  }
}

export const cropVariety = ({
  imageId,
  cropFamily,
  variety,
  ...cropVarietyProperties
}: {
  imageId: string
  cropFamily: farmhand.cropFamily
  variety: farmhand.grapeVariety
} & Partial<farmhand.item>): farmhand.cropVariety => {
  return {
    imageId,
    cropFamily,
    variety,
    ...crop({ ...cropVarietyProperties }),
  }
}
