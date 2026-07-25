import React from 'react'
import { number, object } from 'prop-types'
import Tab from '@mui/material/Tab/index.js'
import Tabs from '@mui/material/Tabs/index.js'

import { recipeType } from '../../enums.js'

import { recipesMap } from '../../data/maps.js'

import FarmhandContext from '../Farmhand/Farmhand.context.js'

import { Div } from '../Elements/index.js'

import { centerTabsSx } from '../../styles/sx.js'
import { useTabQueryParam } from '../../hooks/useTabQueryParam.js'

import { a11yProps } from './TabPanel/index.js'

import { ForgeTabPanel } from './ForgeTabPanel.js'
import { KitchenTabPanel } from './KitchenTabPanel.js'
import { RecyclingTabPanel } from './RecyclingTabPanel.js'
import { WoodChipperTabPanel } from './WoodChipperTabPanel.js'

interface WorkshopProps {
  learnedRecipes: Record<string, boolean>
  purchasedComposter?: number | null
  purchasedSmelter?: number | null
  purchasedWoodChipper?: number | null
  toolLevels: Record<farmhand.toolType, farmhand.toolLevel>
}

const Workshop = ({
  learnedRecipes,
  purchasedComposter,
  purchasedSmelter,
  purchasedWoodChipper,
  toolLevels,
}: WorkshopProps) => {
  const learnedKitchenRecipes = Object.keys(learnedRecipes).filter(
    recipeId => recipesMap[recipeId].recipeType === recipeType.KITCHEN
  )

  const learnedForgeRecipes = Object.keys(learnedRecipes).filter(
    recipeId => recipesMap[recipeId].recipeType === recipeType.FORGE
  )

  const learnedRecyclingRecipes = Object.keys(learnedRecipes).filter(
    recipeId => recipesMap[recipeId].recipeType === recipeType.RECYCLING
  )

  const learnedWoodChipperRecipes = Object.keys(learnedRecipes).filter(
    recipeId => recipesMap[recipeId].recipeType === recipeType.WOOD_CHIPPER
  )

  const showForge = purchasedSmelter

  const recyclingTabIndex = showForge ? 2 : 1
  const woodChipperTabIndex = recyclingTabIndex + (purchasedComposter ? 1 : 0)

  const [currentTab, setCurrentTab] = useTabQueryParam(
    [
      'Kitchen',
      showForge ? 'Forge' : '',
      purchasedComposter ? 'Recycling' : '',
      purchasedWoodChipper ? 'Wood Chipper' : '',
    ].filter(Boolean)
  )

  return (
    <Div className="Workshop" sx={centerTabsSx}>
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
        {purchasedWoodChipper ? (
          <Tab
            {...{ label: 'Wood Chipper', ...a11yProps(woodChipperTabIndex) }}
          />
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
      {purchasedWoodChipper ? (
        <WoodChipperTabPanel
          currentTab={currentTab}
          index={woodChipperTabIndex}
          learnedRecipes={learnedWoodChipperRecipes}
        />
      ) : null}
    </Div>
  )
}

Workshop.propTypes = {
  learnedRecipes: object.isRequired,
  purchasedComposter: number,
  purchasedSmelter: number,
  purchasedWoodChipper: number,
  toolLevels: object.isRequired,
}

export default function Consumer(
  props: Partial<Parameters<typeof Workshop>[0]>
) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Workshop
          {...({
            ...gameState,
            ...handlers,
            ...props,
          } as Parameters<typeof Workshop>[0])}
        />
      )}
    </FarmhandContext.Consumer>
  )
}
