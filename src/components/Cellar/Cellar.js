import React, { useState } from 'react'
import Tab from '@mui/material/Tab/index.js'
import Tabs from '@mui/material/Tabs/index.js'

import { CellarInventoryTabPanel } from './CellarInventoryTabPanel.js'
import { FermentationTabPanel } from './FermentationTabPanel.js'
import { WinemakingTabPanel } from './WinemakingTabPanel.js'
import { a11yProps } from './TabPanel/index.js'

import './Cellar.sass'

export const Cellar = () => {
  const [currentTab, setCurrentTab] = useState(0)

  return (
    <div className="Cellar">
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
    </div>
  )
}

Cellar.propTypes = {}
