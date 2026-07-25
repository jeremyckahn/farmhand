import { useEffect, useState } from 'react'

import {
  getHashQueryParams,
  setHashQueryParam,
} from '../utils/hashQueryParams.js'

const TAB_QUERY_PARAM_NAME = 'tab'

const getTabIndexFromHash = (tabLabels: readonly string[]): number => {
  const tabLabelFromUrl = getHashQueryParams().get(TAB_QUERY_PARAM_NAME)
  const tabIndexFromUrl = tabLabels.indexOf(tabLabelFromUrl ?? '')

  return tabIndexFromUrl === -1 ? 0 : tabIndexFromUrl
}

/**
 * Drop-in replacement for `useState(0)` for a MUI `Tabs`/`Tab` `value`,
 * that also mirrors the active tab's label into the URL hash's `tab`
 * query param so a page reload restores the same tab. Tabs are matched by
 * label rather than raw index, since some screens conditionally omit tabs
 * (e.g. Shop's Saplings tab), which shifts indices around depending on
 * what's unlocked.
 *
 * `tabLabels` can legitimately change shape after the initial render (e.g.
 * a screen mounts before its unlock-dependent tabs are known, then a
 * persisted save loads a moment later and adds one) - re-deriving the
 * index whenever the label list itself changes keeps the restored tab
 * pointing at the right label instead of freezing on its first-render
 * position.
 */
export const useTabQueryParam = (
  tabLabels: readonly string[]
): [number, (tabIndex: number) => void] => {
  const [currentTab, setCurrentTabState] = useState(() =>
    getTabIndexFromHash(tabLabels)
  )

  const tabLabelsKey = tabLabels.join('|')

  useEffect(() => {
    setCurrentTabState(getTabIndexFromHash(tabLabels))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabLabelsKey])

  const setCurrentTab = (tabIndex: number) => {
    setCurrentTabState(tabIndex)

    const tabLabel = tabLabels[tabIndex]

    if (tabLabel) {
      setHashQueryParam(TAB_QUERY_PARAM_NAME, tabLabel)
    }
  }

  return [currentTab, setCurrentTab]
}
