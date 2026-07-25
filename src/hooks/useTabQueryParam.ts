import { useState } from 'react'

import {
  getHashQueryParams,
  setHashQueryParam,
} from '../utils/hashQueryParams.js'

const TAB_QUERY_PARAM_NAME = 'tab'

/**
 * Drop-in replacement for `useState(0)` for a MUI `Tabs`/`Tab` `value`,
 * that also mirrors the active tab's label into the URL hash's `tab`
 * query param so a page reload restores the same tab. Tabs are matched by
 * label rather than raw index, since some screens conditionally omit tabs
 * (e.g. Shop's Saplings tab), which shifts indices around depending on
 * what's unlocked.
 */
export const useTabQueryParam = (
  tabLabels: readonly string[]
): [number, (tabIndex: number) => void] => {
  const [currentTab, setCurrentTabState] = useState(() => {
    const tabLabelFromUrl = getHashQueryParams().get(TAB_QUERY_PARAM_NAME)
    const tabIndexFromUrl = tabLabels.indexOf(tabLabelFromUrl ?? '')

    return tabIndexFromUrl === -1 ? 0 : tabIndexFromUrl
  })

  const setCurrentTab = (tabIndex: number) => {
    setCurrentTabState(tabIndex)

    const tabLabel = tabLabels[tabIndex]

    if (tabLabel) {
      setHashQueryParam(TAB_QUERY_PARAM_NAME, tabLabel)
    }
  }

  return [currentTab, setCurrentTab]
}
