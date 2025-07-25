import React, { useState } from 'react'
import { number, object } from 'prop-types'
import Tab from '@mui/material/Tab/index.js'
import Tabs from '@mui/material/Tabs/index.js'

import { recipeType } from '../../enums.js'

import { recipesMap } from '../../data/maps.js'

import FarmhandContext from '../Farmhand/Farmhand.context.js'

import { a11yProps } from './TabPanel/index.js'

import { ForgeTabPanel } from './ForgeTabPanel.js'
import { KitchenTabPanel } from './KitchenTabPanel.js'
import { RecyclingTabPanel } from './RecyclingTabPanel.js'

import './Workshop.sass'

const Workshop = ({
  learnedRecipes,
  purchasedComposter,
  purchasedSmelter,
  toolLevels,
}) => {
  const [currentTab, setCurrentTab] = useState(0)

  const learnedKitchenRecipes = Object.keys(learnedRecipes).filter(
    recipeId => recipesMap[recipeId].recipeType === recipeType.KITCHEN
  )

  const learnedForgeRecipes = Object.keys(learnedRecipes).filter(
    recipeId => recipesMap[recipeId].recipeType === recipeType.FORGE
  )

  const learnedRecyclingRecipes = Object.keys(learnedRecipes).filter(
    recipeId => recipesMap[recipeId].recipeType === recipeType.RECYCLING
  )

  const showForge = purchasedSmelter

  const recyclingTabIndex = showForge ? 2 : 1

  return (
    <div className="Workshop">
      <Tabs
        value={currentTab}
        onChange={(_e, newTab) => setCurrentTab(newTab)}
        aria-label="Workshop tabs"
      >
        <Tab {...{ label: 'Kitchen', ...a11yProps(0) }} />
        {showForge ? <Tab {...{ label: 'Forge', ...a11yProps(1) }} /> : null}
        {purchasedComposter ? (
          <Tab {...{ label: 'Recycling', ...a11yProps(recyclingTabIndex) }} />
        ) : null}
      </Tabs>
      <KitchenTabPanel
        currentTab={currentTab}
        index={0}
        learnedKitchenRecipes={learnedKitchenRecipes}
      />
      {showForge ? (
        <ForgeTabPanel
          currentTab={currentTab}
          index={1}
          learnedForgeRecipes={learnedForgeRecipes}
          toolLevels={toolLevels}
        />
      ) : null}
      {purchasedComposter ? (
        <RecyclingTabPanel
          currentTab={currentTab}
          index={recyclingTabIndex}
          learnedRecipes={learnedRecyclingRecipes}
        />
      ) : null}
    </div>
  )
}

Workshop.propTypes = {
  learnedRecipes: object.isRequired,
  purchasedComposter: number,
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
