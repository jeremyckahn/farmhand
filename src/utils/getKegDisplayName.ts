import { vinegarService } from '../services/vinegar.js'
import { wineService } from '../services/wine.js'
import { FERMENTED_CROP_NAME } from '../templates.js'

export const getKegDisplayName = (item: farmhand.item): string => {
  if (wineService.isWineRecipe(item) || vinegarService.isVinegarRecipe(item)) {
    return item.name
  }

  return FERMENTED_CROP_NAME('', item)
}
