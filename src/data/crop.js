import { fieldMode, itemType } from '../enums'

const { freeze } = Object

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

export const fromSeed = ({ cropTimetable, cropType, growsInto, tier }) => ({
  cropTimetable,
  cropType,
  doesPriceFluctuate: true,
  id: growsInto,
  tier,
  type: itemType.CROP,
})
