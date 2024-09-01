import { fertilizerType, itemType } from '../../enums.js'
import { getPlotContentType } from '../../utils/index.js'
import { FERTILIZER_BONUS } from '../../constants.js'

/**
 * @param {?farmhand.crop} crop
 * @returns {?farmhand.crop}
 */
export const incrementPlotContentAge = crop =>
  crop && getPlotContentType(crop) === itemType.CROP
    ? {
        ...crop,
        daysOld: crop.daysOld + 1,
        daysWatered:
          crop.daysWatered +
          (crop.wasWateredToday
            ? 1 +
              (crop.fertilizerType === fertilizerType.NONE
                ? 0
                : FERTILIZER_BONUS)
            : 0),
      }
    : crop
