import { testCrop } from '../../test-utils'
import { FERTILIZER_BONUS } from '../../constants'
import { fertilizerType } from '../../enums'

import { incrementPlotContentAge } from './incrementPlotContentAge'

vitest.mock('../../data/maps')
vitest.mock('../../data/items')

describe('incrementPlotContentAge', () => {
  describe('plot contains a crop', () => {
    describe('crop is not watered', () => {
      test('updates daysOld', () => {
        const { daysOld, daysWatered } = incrementPlotContentAge(
          testCrop({ itemId: 'sample-crop-1' })
        )

        expect(daysOld).toBe(1)
        expect(daysWatered).toBe(0)
      })
    })

    describe('crop is watered', () => {
      test('updates daysOld and daysWatered', () => {
        const { daysOld, daysWatered } = incrementPlotContentAge(
          testCrop({ itemId: 'sample-crop-1', wasWateredToday: true })
        )

        expect(daysOld).toBe(1)
        expect(daysWatered).toBe(1)
      })
    })

    describe('crop is fertilized', () => {
      test('updates daysOld with bonus', () => {
        const { daysWatered } = incrementPlotContentAge(
          testCrop({
            itemId: 'sample-crop-1',
            fertilizerType: fertilizerType.STANDARD,
            wasWateredToday: true,
          })
        )

        expect(daysWatered).toBe(1 + FERTILIZER_BONUS)
      })
    })
  })

  describe('plot contains a non-crop item', () => {
    test('plot content is not changed', () => {
      const plotContent = testCrop({ itemId: 'scarecrow' })

      expect(incrementPlotContentAge(plotContent)).toBe(plotContent)
    })
  })
})
