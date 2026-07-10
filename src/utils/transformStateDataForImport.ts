import { stageFocusType } from '../enums.js'
import { STANDARD_VIEW_LIST } from '../constants.js'

import { farmProductsSold } from './farmProductsSold.js'

export const transformStateDataForImport = (
  state: farmhand.state
): farmhand.state => {
  let sanitizedState: Record<string, unknown> = { ...state }

  const rejectedKeys = ['version']

  rejectedKeys.forEach(rejectedKey => delete sanitizedState[rejectedKey])

  if (sanitizedState.experience === 0) {
    sanitizedState.experience = farmProductsSold(sanitizedState.itemsSold || {})
  }

  if (
    sanitizedState.showHomeScreen === false &&
    sanitizedState.stageFocus === stageFocusType.HOME
  ) {
    sanitizedState = {
      ...sanitizedState,
      stageFocus: STANDARD_VIEW_LIST[0] as farmhand.stageFocusType,
    }
  }

  // NOTE: This is a mitigation for
  // https://github.com/jeremyckahn/farmhand/issues/546. There's no expected
  // scenario where a cow would be present in cowBreedingPen but not
  // cowInventory, but at least one player's game somehow got into that state.
  // This block detects such an invalid state and corrects it.
  {
    // TODO: Add defensive check safeguards for sanitizedState.cowBreedingPen
    // and sanitizedState.cowInventory to prevent TypeError crashes during
    // corrupt/legacy state imports.
    const {
      cowId1,
      cowId2,
    } = sanitizedState.cowBreedingPen as farmhand.state['cowBreedingPen']

    const cowPenIdMap = (sanitizedState.cowInventory as farmhand.cow[]).reduce(
      (acc: Record<string, farmhand.cow>, cow: farmhand.cow) => {
        acc[cow.id] = cow

        return acc
      },
      {}
    )

    const isCowInBreedingPenMissingFromInventory = [cowId1, cowId2].some(
      cowId => {
        return cowId && !(cowId in cowPenIdMap)
      }
    )

    if (isCowInBreedingPenMissingFromInventory) {
      // Resets cowBreedingPen state
      sanitizedState.cowBreedingPen = {
        cowId1: null,
        cowId2: null,
        daysUntilBirth: -1,
      }
    }
  }

  // NOTE: Legacy data trasformation for https://github.com/jeremyckahn/farmhand/issues/387
  if (sanitizedState.id) {
    sanitizedState.playerId = sanitizedState.id
    delete sanitizedState.id
  }

  return (sanitizedState as unknown) as farmhand.state
}
