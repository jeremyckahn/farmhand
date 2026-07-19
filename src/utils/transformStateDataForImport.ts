import { stageFocusType, toolLevel, toolType } from '../enums.js'
import { STANDARD_VIEW_LIST } from '../constants.js'

import { farmProductsSold } from './farmProductsSold.js'
import { getLevelEntitlements } from './getLevelEntitlements.js'
import { levelAchieved } from './levelAchieved.js'

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

  // NOTE: Legacy data transformation for saves persisted before the AXE and
  // PICKER_POLE tools were added. toolLevels is merged as a whole object on
  // import (see useFarmhand.ts), so an old save's toolLevels has no key at
  // all for a newly-added tool rather than an explicit UNAVAILABLE -
  // leaving Toolbelt.tsx unable to resolve a tool image for it and
  // crashing on tool.level.toLowerCase().
  //
  // A save whose player is already past the level that unlocks a tool (see
  // levels.ts) never gets another chance to unlock it retroactively -
  // processLevelUp only fires on a *new* level-up crossing that threshold,
  // not on load - so backfill straight to DEFAULT for those players rather
  // than leaving them permanently locked out of a tool they should already
  // have.
  for (const backfilledToolType of [toolType.AXE, toolType.PICKER_POLE]) {
    if (
      sanitizedState.toolLevels &&
      !(sanitizedState.toolLevels as farmhand.state['toolLevels'])[
        backfilledToolType
      ]
    ) {
      const hasUnlockedTool = Boolean(
        getLevelEntitlements(
          levelAchieved((sanitizedState.experience ?? 0) as number)
        ).tools[backfilledToolType]
      )

      sanitizedState.toolLevels = {
        ...(sanitizedState.toolLevels as farmhand.state['toolLevels']),
        [backfilledToolType]: hasUnlockedTool
          ? toolLevel.DEFAULT
          : toolLevel.UNAVAILABLE,
      }
    }
  }

  return (sanitizedState as unknown) as farmhand.state
}
