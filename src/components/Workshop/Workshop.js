import React, { useState } from 'react'
import { number, object } from 'prop-types'
import AppBar from '@material-ui/core/AppBar'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'

import { features } from '../../config'
import { recipeType } from '../../enums'

import { recipesMap } from '../../data/maps'

import FarmhandContext from '../Farmhand/Farmhand.context'

import { a11yProps } from './TabPanel'

import { ForgeTabPanel } from './ForgeTabPanel'
import { KitchenTabPanel } from './KitchenTabPanel'

import './Workshop.sass'

const Workshop = ({ learnedRecipes, purchasedSmelter, toolLevels }) => {
  const [currentTab, setCurrentTab] = useState(0)

  const learnedKitchenRecipes = Object.keys(learnedRecipes).filter(
    recipeId => recipesMap[recipeId].recipeType === recipeType.KITCHEN
  )

  const learnedForgeRecipes = Object.keys(learnedRecipes).filter(
    recipeId => recipesMap[recipeId].recipeType === recipeType.FORGE
  )

  const showForge = features.MINING && purchasedSmelter

  return (
    <div className="Workshop">
      <AppBar position="static" color="primary">
        <Tabs
          value={currentTab}
          onChange={(e, newTab) => setCurrentTab(newTab)}
          aria-label="Workshop tabs"
        >
          <Tab {...{ label: 'Kitchen', ...a11yProps(0) }} />
          {showForge ? <Tab {...{ label: 'Forge', ...a11yProps(1) }} /> : null}
        </Tabs>
      </AppBar>
      <KitchenTabPanel
        currentTab={currentTab}
        index={0}
        learnedKitchenRecipes={learnedKitchenRecipes}
        setCurrentTab={setCurrentTab}
      />
      {showForge ? (
        <ForgeTabPanel
          currentTab={currentTab}
          index={1}
          learnedForgeRecipes={learnedForgeRecipes}
          setCurrentTab={setCurrentTab}
          toolLevels={toolLevels}
        />
      ) : null}
    </div>
  )
}

Workshop.propTypes = {
  learnedRecipes: object.isRequired,
  purchasedSmelter: number,
  toolLevels: object.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Workshop {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
