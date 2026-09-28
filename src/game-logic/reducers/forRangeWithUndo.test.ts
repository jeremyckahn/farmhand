import { testCrop } from '../../test-utils/index.js'
import { toolType, toolLevel } from '../../enums.js'
import { INFINITE_STORAGE_LIMIT } from '../../constants.js'
import { saveDataStubFactory } from '../../test-utils/stubs/saveDataStubFactory.js'

import { clearPlot } from './clearPlot.js'
import { forRangeWithUndo } from './forRangeWithUndo.js'

vitest.mock('../../data/maps.js')

const toolLevels = {
  [toolType.HOE]: toolLevel.DEFAULT,
  [toolType.SCYTHE]: toolLevel.UNAVAILABLE,
  [toolType.SHOVEL]: toolLevel.UNAVAILABLE,
  [toolType.WATERING_CAN]: toolLevel.UNAVAILABLE,
}

describe('forRangeWithUndo', () => {
  test('applies the reducer to the whole range', () => {
    const { field } = forRangeWithUndo(
      saveDataStubFactory({
        field: [
          [
            testCrop({ itemId: 'sample-crop-1' }),
            testCrop({ itemId: 'sample-crop-1' }),
          ],
        ],
        toolLevels,
        inventory: [],
        inventoryLimit: INFINITE_STORAGE_LIMIT,
      }),
      clearPlot,
      1,
      0,
      0
    )

    expect(field[0]).toEqual([null, null])
  })

  test('records a single snapshot covering the whole range', () => {
    const state = saveDataStubFactory({
      field: [
        [
          testCrop({ itemId: 'sample-crop-1' }),
          testCrop({ itemId: 'sample-crop-1' }),
        ],
      ],
      toolLevels,
      inventory: [],
      inventoryLimit: INFINITE_STORAGE_LIMIT,
    })

    const nextState = forRangeWithUndo(state, clearPlot, 1, 0, 0)

    expect(nextState.undoSnapshot?.before.field).toBe(state.field)
    expect(nextState.undoSnapshot?.before.inventory).toBe(state.inventory)
    expect(nextState.undoSnapshot?.after.field).toBe(nextState.field)
    expect(nextState.undoSnapshot?.after.inventory).toBe(nextState.inventory)
  })

  test('keeps the existing snapshot if nothing changed', () => {
    const existingSnapshot = {
      before: { field: [[null]], inventory: [] },
      after: { field: [[null]], inventory: [] },
    }

    // Set after the stub factory, since it runs computeStateForNextDay (which
    // clears any undo snapshot).
    const state = {
      ...saveDataStubFactory({ field: [[null]], toolLevels, inventory: [] }),
      undoSnapshot: existingSnapshot,
    }

    const { undoSnapshot } = forRangeWithUndo(state, clearPlot, 0, 0, 0)

    expect(undoSnapshot).toBe(existingSnapshot)
  })
})
