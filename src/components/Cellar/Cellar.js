import React, { useContext, useState } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'

import { recipesMap } from '../../data/maps'
import { recipeType } from '../../enums'

import FarmhandContext from '../Farmhand/Farmhand.context'

import { FermentationTabPanel } from './FermentationTabPanel'
import { a11yProps } from './TabPanel'

import './Cellar.sass'

export const Cellar = () => {
  const {
    gameState: { learnedRecipes },
  } = useContext(FarmhandContext)

  const [currentTab, setCurrentTab] = useState(0)

  const learnedFermentationRecipes = Object.keys(learnedRecipes).filter(
    recipeId => recipesMap[recipeId].recipeType === recipeType.FERMENTATION
  )

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
      <FermentationTabPanel
        index={0}
        currentTab={currentTab}
        learnedFermentationRecipes={learnedFermentationRecipes}
      />
    </div>
  )
}

Cellar.propTypes = {}
