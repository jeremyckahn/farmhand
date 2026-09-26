/**
 * Checkpoints an in-progress Farmhand Shuffle match. Per the resume design,
 * this should only be called by `FarmhandShuffleView` (see the plan's 2.4)
 * at the two "idle, waiting on the human player" machine states - not on
 * every transient mid-action state - so a hard crash mid-action resumes
 * from the last idle checkpoint rather than losing more progress than
 * necessary.
 *
 * Callers should follow this up with `handlers.persistState()` to flush the
 * checkpoint immediately, rather than waiting for the next day-advance
 * persistence cycle.
 */
export const saveFarmhandShuffleMatch = (
  state: farmhand.state,
  serializedMatch: farmhand.SerializedFarmhandShuffleMatch
): farmhand.state => ({
  ...state,
  farmhandShuffle: {
    ...state.farmhandShuffle,
    serializedMatch,
  },
})
