import { STANDARD_VIEW_LIST } from '../constants.js'
import { stageFocusType } from '../enums.js'

/**
 * The ordered list of views available for a given state, mirroring what's
 * actually unlocked (Home screen preference, Forest, Cow Pen, Cellar).
 * Pulled out as a standalone function (rather than only living inline as a
 * useMemo in useFarmhand.ts) so it can also be used to validate an
 * externally-supplied view (e.g. from the URL hash) against a specific
 * state snapshot - which may not be the live, currently-rendered state,
 * such as a save being loaded during boot or import.
 */
export const getViewList = ({
  isForestUnlocked,
  purchasedCellar,
  purchasedCowPen,
  showHomeScreen,
}: {
  isForestUnlocked: boolean
  purchasedCellar: number
  purchasedCowPen: number
  showHomeScreen: boolean
}): stageFocusType[] => {
  const { CELLAR, COW_PEN, HOME, WORKSHOP, FOREST } = stageFocusType
  const list: stageFocusType[] = [...STANDARD_VIEW_LIST]

  if (showHomeScreen) {
    list.unshift(HOME)
  }

  if (isForestUnlocked) {
    list.push(FOREST)
  }

  if (purchasedCowPen) {
    list.push(COW_PEN)
  }

  list.push(WORKSHOP)

  if (purchasedCellar) {
    list.push(CELLAR)
  }

  return list
}
