/**
 * Reverts the field action recorded by forRangeWithUndo. It is a no-op if
 * there is no snapshot, or if the field or inventory have been changed by
 * anything else since the snapshot was taken (selling, crafting, a new day,
 * loading a save, etc.), because restoring it then could duplicate items.
 */
export const undoFieldAction = (state: farmhand.state): farmhand.state => {
  const { undoSnapshot } = state

  if (!undoSnapshot) {
    return state
  }

  const { after, before } = undoSnapshot

  if (state.field !== after.field || state.inventory !== after.inventory) {
    return { ...state, undoSnapshot: null }
  }

  return { ...state, ...before, undoSnapshot: null }
}
