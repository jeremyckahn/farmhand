import { forRange } from './forRange.js'

const getUndoSlices = ({
  field,
  inventory,
}: farmhand.state): farmhand.fieldUndoSlices => ({
  field,
  inventory,
})

/**
 * Performs forRange and records an undo snapshot for the whole range, so
 * that undoFieldAction can revert it as a single action.
 *
 * The snapshot holds references to the previous state slices rather than
 * copies. Reducers never mutate state, so the old slices are guaranteed to be
 * unchanged. Restoring references (rather than re-deriving plots from item
 * IDs) also preserves any random outcome and per-plot state exactly.
 */
export const forRangeWithUndo = (
  state: farmhand.state,
  fieldFn: Parameters<typeof forRange>[1],
  rangeRadius: number,
  plotX: number,
  plotY: number,
  ...args: any[]
): farmhand.state => {
  const nextState = forRange(state, fieldFn, rangeRadius, plotX, plotY, ...args)

  if (
    nextState.field === state.field &&
    nextState.inventory === state.inventory
  ) {
    // Nothing was changed (e.g. an empty plot was clicked), so keep whatever
    // undo snapshot already exists.
    return nextState
  }

  return {
    ...nextState,
    undoSnapshot: {
      before: getUndoSlices(state),
      after: getUndoSlices(nextState),
    },
  }
}
