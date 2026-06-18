import { getSeedItemIdFromFinalStageCropItemId } from './getSeedItemIdFromFinalStageCropItemId.js'

describe('getSeedItemIdFromFinalStageCropItemId', () => {
  test('gets seed item from crop item', () => {
    expect(getSeedItemIdFromFinalStageCropItemId('carrot')).toEqual(
      'carrot-seed'
    )
  })

  test('gets seed item from crop item with varieties', () => {
    expect(getSeedItemIdFromFinalStageCropItemId('grape-chardonnay')).toEqual(
      'grape-seed'
    )
  })
})
