import React from 'react'
import { number, array, object } from 'prop-types'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import ReactMarkdown from 'react-markdown'

import { recipeType } from '../../enums'
import { recipeCategories } from '../../data/maps'
import UpgradePurchase from '../UpgradePurchase'
import { RecipeList } from '../RecipeList/RecipeList'

import { TabPanel } from './TabPanel'

import { getUpgradesAvailable } from './getUpgradesAvailable'

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
