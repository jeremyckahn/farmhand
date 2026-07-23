import { carrot } from '../data/crops/index.js'
import { wineChardonnay } from '../data/recipes.js'
import { FERMENTED_CROP_NAME } from '../templates.js'

import { getKegDisplayName } from './getKegDisplayName.js'

describe('getKegDisplayName', () => {
  test('returns the item name for a wine recipe', () => {
    expect(getKegDisplayName(wineChardonnay)).toEqual(wineChardonnay.name)
  })

  test('returns the fermented crop name for a generic fermentable item', () => {
    expect(getKegDisplayName(carrot as farmhand.item)).toEqual(
      FERMENTED_CROP_NAME('', carrot as farmhand.item)
    )
  })
})
