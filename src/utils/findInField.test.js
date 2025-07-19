import { carrot, pumpkin } from '../data/crops/index.js'
import { fertilizerType } from '../enums.js'

import { findInField } from './findInField.js'

const carrotPlot = {
  itemId: carrot.id,
  fertilizerType: fertilizerType.NONE,
}

describe('findInField', () => {
  /** @type {farmhand.state['field']} */
  const field = [[null, carrotPlot, null]]

  test('returns the desired plot from the field', () => {
    const foundPlot = findInField(field, plot => {
      return plot?.itemId === carrot.id
    })

    expect(foundPlot).toEqual(carrotPlot)
  })

  test('yields null if desired plot is not in the field', () => {
    const foundPlot = findInField(field, plot => {
      return plot?.itemId === pumpkin.id
    })

    expect(foundPlot).toEqual(null)
  })
})
