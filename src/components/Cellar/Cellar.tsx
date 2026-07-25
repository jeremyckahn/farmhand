import Tab from '@mui/material/Tab/index.js'
import Tabs from '@mui/material/Tabs/index.js'

import { centerTabsSx } from '../../styles/sx.js'
import { Div } from '../Elements/index.js'
import { useTabQueryParam } from '../../hooks/useTabQueryParam.js'

import { CellarInventoryTabPanel } from './CellarInventoryTabPanel.js'
import { FermentationTabPanel } from './FermentationTabPanel.js'
import { a11yProps } from './TabPanel/index.js'
import { WinemakingTabPanel } from './WinemakingTabPanel.js'

const CELLAR_TAB_LABELS = ['Cellar Inventory', 'Fermentation', 'Winemaking']

export const Cellar = () => {
  const [currentTab, setCurrentTab] = useTabQueryParam(CELLAR_TAB_LABELS)

  return (
    <Div className="Cellar" sx={centerTabsSx}>
      <Tabs
        value={currentTab}
        onChange={(_e, newTab) => setCurrentTab(newTab)}
        aria-label="Cellar tabs"
      >
        <Tab {...{ label: 'Cellar Inventory', ...a11yProps(0) }} />
        <Tab {...{ label: 'Fermentation', ...a11yProps(1) }} />
        <Tab {...{ label: 'Winemaking', ...a11yProps(2) }} />
      </Tabs>
      <CellarInventoryTabPanel index={0} currentTab={currentTab} />
      <FermentationTabPanel index={1} currentTab={currentTab} />
      <WinemakingTabPanel index={2} currentTab={currentTab} />
    </Div>
  )
}

Cellar.propTypes = {}
