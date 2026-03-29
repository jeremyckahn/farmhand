import { COW_GESTATION_PERIOD_DAYS } from '../../constants.js'

/**
 * @param {farmhand.cow} cow
 * @param {farmhand.cowBreedingPen} cowBreedingPen
 * @param {Array.<farmhand.cow>} cowInventory
 * @return {boolean}
 */
const cowCanBeAdded = (cow, cowBreedingPen, cowInventory) => {
  const { cowId1, cowId2 } = cowBreedingPen
  const isBreedingPenFull = cowId1 !== null && cowId2 !== null
  const isCowInBreedingPen = cowId1 === cow.id || cowId2 === cow.id

  const isCowInInventory = !!cowInventory.find(({ id }) => {
    return id === cow.id
  })

  return isCowInInventory && !isBreedingPenFull && !isCowInBreedingPen
}

/**
 * @param {farmhand.state} state
 * @param {farmhand.cow} cow
 * @param {boolean} isAdding If true, cow will be added to the breeding pen. If
 * false, they will be removed.
 * @returns {farmhand.state}
 */
export const changeCowBreedingPenResident = (state, cow, isAdding) => {
  const { cowBreedingPen, cowInventory } = state
  const { cowId1, cowId2 } = cowBreedingPen
  const isCowInBreedingPen = cowId1 === cow.id || cowId2 === cow.id
  let newCowBreedingPen = { ...cowBreedingPen }

  if (isAdding && !cowCanBeAdded(cow, cowBreedingPen, cowInventory)) {
    return state
  }

  if (!isAdding && !isCowInBreedingPen) {
    return state
  }

  if (isAdding) {
    const breedingPenCowId = cowId1 === null ? 'cowId1' : 'cowId2'
    newCowBreedingPen = { ...newCowBreedingPen, [breedingPenCowId]: cow.id }
  } else {
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
