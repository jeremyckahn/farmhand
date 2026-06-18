import { getRangeCoords } from './getRangeCoords.js'

describe('getRangeCoords', () => {
  describe('surrounded by plots', () => {
    test('computes the plot range', () => {
      expect(getRangeCoords(1, 1, 1)).toEqual([
        [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 2, y: 0 },
        ],
        [
          { x: 0, y: 1 },
          { x: 1, y: 1 },
          { x: 2, y: 1 },
        ],
        [
          { x: 0, y: 2 },
          { x: 1, y: 2 },
          { x: 2, y: 2 },
        ],
      ])
    })
  })

  describe('edge testing', () => {
    test('in-range plots below field bounds are negative', () => {
      expect(getRangeCoords(1, 0, 0)).toEqual([
        [
          { x: -1, y: -1 },
          { x: 0, y: -1 },
          { x: 1, y: -1 },
        ],
        [
          { x: -1, y: 0 },
          { x: 0, y: 0 },
          { x: 1, y: 0 },
        ],
        [
          { x: -1, y: 1 },
          { x: 0, y: 1 },
          { x: 1, y: 1 },
        ],
      ])
    })
  })
})
