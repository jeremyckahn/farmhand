import React from 'react'
import { number, array, object } from 'prop-types'

import Card from '@mui/material/Card/index.js'
import CardContent from '@mui/material/CardContent/index.js'
import Divider from '@mui/material/Divider/index.js'
import ReactMarkdown from 'react-markdown'

import { recipeType } from '../../enums.js'
import { recipeCategories } from '../../data/maps.js'
import UpgradePurchase from '../UpgradePurchase/index.js'
import { RecipeList } from '../RecipeList/RecipeList.js'

import { TabPanel } from './TabPanel/index.js'

import { getUpgradesAvailable } from './getUpgradesAvailable.js'

export function ForgeTabPanel({
  currentTab,
  index,
  learnedForgeRecipes,
  toolLevels,
}) {
  const upgradesAvailable = getUpgradesAvailable({
    toolLevels,
    learnedForgeRecipes,
  })

  return (
    <TabPanel value={currentTab} index={index}>
      <RecipeList
        learnedRecipes={learnedForgeRecipes}
        allRecipes={recipeCategories[recipeType.FORGE]}
      />
      {upgradesAvailable.length ? (
        <>
          <Divider />
          <ul className="card-list">
            <li>
              <h4>Tool Upgrades</h4>
            </li>
            {upgradesAvailable.map(upgrade => (
              <li key={upgrade.id}>
                <UpgradePurchase upgrade={upgrade} />
              </li>
            ))}
          </ul>
        </>
      ) : null}
      <Divider />
      <ul className="card-list">
        <li>
          <Card>
            <CardContent>
              <ReactMarkdown
                {...{
                  linkTarget: '_blank',
                  className: 'markdown',
                  source: `Forge recipes are learned by selling resources mined from the field.`,
                }}
              />
            </CardContent>
          </Card>
        </li>
      </ul>
    </TabPanel>
  )
}

ForgeTabPanel.propTypes = {
  currentTab: number.isRequired,
  index: number.isRequired,
  learnedForgeRecipes: array.isRequired,
  toolLevels: object.isRequired,
}
