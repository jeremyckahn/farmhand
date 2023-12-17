import React, { useState } from 'react'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'

import { CellarInventoryTabPanel } from './CellarInventoryTabPanel'
import { FermentationTabPanel } from './FermentationTabPanel'
import { a11yProps } from './TabPanel'

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
      </Tabs>
      <CellarInventoryTabPanel index={0} currentTab={currentTab} />
      <FermentationTabPanel index={1} currentTab={currentTab} />
    </div>
  )
}

Cellar.propTypes = {}
