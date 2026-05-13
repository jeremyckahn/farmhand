import { fertilizerType, itemType } from '../../enums.js'
import { getPlotContentType } from '../../utils/index.js'
import { FERTILIZER_BONUS } from '../../constants.js'

export const incrementPlotContentAge = (
  crop: farmhand.crop | null
): farmhand.crop | null =>
  crop && getPlotContentType(crop) === itemType.CROP
    ? {
        ...crop,
        daysOld: (crop.daysOld || 0) + 1,
        daysWatered:
          (crop.daysWatered || 0) +
          (crop.wasWateredToday
            ? 1 +
              (crop.fertilizerType === fertilizerType.NONE
                ? 0
                : FERTILIZER_BONUS)
            : 0),
      }
    : crop
