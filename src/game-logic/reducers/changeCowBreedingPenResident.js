import { COW_GESTATION_PERIOD_DAYS } from '../../constants'

/**
 * @param {farmhand.state} state
 * @param {farmhand.cow} cow
 * @param {boolean} doAdd If true, cow will be added to the breeding pen. If
 * false, they will be removed.
 * @returns {farmhand.state}
 */
export const changeCowBreedingPenResident = (state, cow, doAdd) => {
  const { cowBreedingPen } = state
  const { cowId1, cowId2 } = cowBreedingPen
  const isPenFull = cowId1 !== null && cowId2 !== null
  const isCowInPen = cowId1 === cow.id || cowId2 === cow.id
  let newCowBreedingPen = { ...cowBreedingPen }

  if (doAdd) {
    if (isPenFull || isCowInPen) {
      return state
    }

    const cowId = cowId1 === null ? 'cowId1' : 'cowId2'
    newCowBreedingPen = { ...newCowBreedingPen, [cowId]: cow.id }
  } else {
    if (!isCowInPen) {
      return state
    }

    if (cowId1 === cow.id) {
      newCowBreedingPen = {
        ...newCowBreedingPen,
        cowId1: newCowBreedingPen.cowId2,
      }
    }

    newCowBreedingPen = { ...newCowBreedingPen, cowId2: null }
  }

  return {
    ...state,
    cowBreedingPen: {
      ...newCowBreedingPen,
      daysUntilBirth: COW_GESTATION_PERIOD_DAYS,
    },
  }
}
