import React, { useState } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'

import { a11yProps } from './TabPanel'
import { FermentationTabPanel } from './FermentationTabPanel'

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
          <Tab {...{ label: 'Fermentation', ...a11yProps(0) }} />
        </Tabs>
      </AppBar>
      <FermentationTabPanel currentTab={currentTab} />
    </div>
  )
}

Cellar.propTypes = {}
