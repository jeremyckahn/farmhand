import { testCrop } from '../../test-utils/index.js'
import { toolType, toolLevel } from '../../enums.js'
import { INFINITE_STORAGE_LIMIT } from '../../constants.js'
import { saveDataStubFactory } from '../../test-utils/stubs/saveDataStubFactory.js'
import { getPlotContentFromItemId } from '../../utils/getPlotContentFromItemId.js'

import { addItemToInventory } from './addItemToInventory.js'
import { clearPlot } from './clearPlot.js'
import { forRangeWithUndo } from './forRangeWithUndo.js'
import { undoFieldAction } from './undoFieldAction.js'

vitest.mock('../../data/maps.js')

const toolLevels = {
  [toolType.HOE]: toolLevel.DEFAULT,
  [toolType.SCYTHE]: toolLevel.UNAVAILABLE,
  [toolType.SHOVEL]: toolLevel.UNAVAILABLE,
  [toolType.WATERING_CAN]: toolLevel.UNAVAILABLE,
}

const getStateAfterClearingScarecrow = () => {
  const initialState = saveDataStubFactory({
    field: [[getPlotContentFromItemId('scarecrow')]],
    toolLevels,
    inventory: [],
    inventoryLimit: INFINITE_STORAGE_LIMIT,
  })

  return {
    initialState,
    clearedState: forRangeWithUndo(initialState, clearPlot, 0, 0, 0),
  }
}

describe('undoFieldAction', () => {
  test('is a no-op if there is no snapshot', () => {
    const state = saveDataStubFactory({})

    expect(undoFieldAction(state)).toBe(state)
  })

  test('restores the field and inventory from before the action', () => {
    const { initialState, clearedState } = getStateAfterClearingScarecrow()

    // Sanity check: clearing returned the scarecrow to the inventory
    expect(clearedState.field[0][0]).toBe(null)
    expect(clearedState.inventory).toEqual([{ id: 'scarecrow', quantity: 1 }])

    const undoneState = undoFieldAction(clearedState)

    expect(undoneState.field).toBe(initialState.field)
    expect(undoneState.inventory).toBe(initialState.inventory)
    expect(undoneState.undoSnapshot).toBe(null)
  })

  test('restores everything a ranged action changed', () => {
    const initialState = saveDataStubFactory({
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

    const undoneState = undoFieldAction(
      forRangeWithUndo(initialState, clearPlot, 1, 0, 0)
    )

    expect(undoneState.field).toBe(initialState.field)
  })

  test('refuses to restore if the inventory changed since the action', () => {
    const { clearedState } = getStateAfterClearingScarecrow()

    // e.g. the returned item was sold or used in a recipe afterwards
    const changedState = addItemToInventory(clearedState, {
      id: 'sample-item-1',
    } as farmhand.item)

    const undoneState = undoFieldAction(changedState)

    expect(undoneState.field).toBe(changedState.field)
    expect(undoneState.inventory).toBe(changedState.inventory)
    expect(undoneState.undoSnapshot).toBe(null)
  })

  test('refuses to restore if the field changed since the action', () => {
    const { clearedState } = getStateAfterClearingScarecrow()

    const changedState = { ...clearedState, field: [[null, null]] }

    const undoneState = undoFieldAction(changedState)

    expect(undoneState.field).toBe(changedState.field)
    expect(undoneState.undoSnapshot).toBe(null)
  })
})
