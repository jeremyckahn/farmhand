import { stageFocusType } from '../enums.js'

import { getLevelEntitlements } from './getLevelEntitlements.js'
import { getViewList } from './getViewList.js'
import { getHashQueryParams } from './hashQueryParams.js'
import { levelAchieved } from './levelAchieved.js'

/**
 * Reads the URL hash's `view` param and returns it only if it names a view
 * that's actually unlocked for the given state - guards against a
 * bookmarked/shared URL (or a stale browser history entry reached via
 * back/forward) pointing at a screen the current save hasn't unlocked,
 * since Stage.tsx renders whichever view stageFocus names with no unlock
 * check of its own. Used both at boot and when reacting to popstate.
 */
export const getValidatedStageFocusFromHash = (
  candidateState: Pick<
    farmhand.state,
    'experience' | 'purchasedCellar' | 'purchasedCowPen' | 'showHomeScreen'
  >
): farmhand.stageFocusType | undefined => {
  const stageFocusFromUrl = getHashQueryParams().get('view')

  if (!stageFocusFromUrl) return undefined

  const isForestUnlockedForState = getLevelEntitlements(
    levelAchieved(candidateState.experience)
  ).stageFocusType[stageFocusType.FOREST]

  const availableViews = getViewList({
    isForestUnlocked: isForestUnlockedForState,
    purchasedCellar: candidateState.purchasedCellar,
    purchasedCowPen: candidateState.purchasedCowPen,
    showHomeScreen: candidateState.showHomeScreen,
  })

  return availableViews.includes(stageFocusFromUrl as farmhand.stageFocusType)
    ? (stageFocusFromUrl as farmhand.stageFocusType)
    : undefined
}
