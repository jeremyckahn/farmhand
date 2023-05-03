import React, { useState } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'

import { InventoryTabPanel } from './InventoryTabPanel'
import { FermentationTabPanel } from './FermentationTabPanel'
import { a11yProps } from './TabPanel'

import './Cellar.sass'

export const Cellar = () => {
  const [currentTab, setCurrentTab] = useState(0)

  return (
    <div className="Cellar">
      <AppBar position="static" color="primary">
        <Tabs
          value={currentTab}
          onChange={(_e, newTab) => setCurrentTab(newTab)}
          aria-label="Cellar tabs"
        >
          <Tab {...{ label: 'Cellar Inventory', ...a11yProps(0) }} />
          <Tab {...{ label: 'Fermentation', ...a11yProps(1) }} />
        </Tabs>
      </AppBar>
      <InventoryTabPanel index={0} currentTab={currentTab} />
      <FermentationTabPanel index={1} currentTab={currentTab} />
    </div>
  )
}

Cellar.propTypes = {}
