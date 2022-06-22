import React from 'react'
import PropTypes from 'prop-types'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Divider from '@material-ui/core/Divider'
import ReactMarkdown from 'react-markdown'

import { recipeType } from '../../enums'

import { recipeCategories } from '../../data/maps'

import UpgradePurchase from '../UpgradePurchase'

import { TabPanel } from './TabPanel'
import { RecipeList } from './RecipeList'

import { getUpgradesAvailable } from './getUpgradesAvailable'

export function ForgeTabPanel({
  currentTab,
  learnedForgeRecipes,
  setCurrentTab,
  toolLevels,
}) {
  const upgradesAvailable = getUpgradesAvailable({
    toolLevels,
    learnedForgeRecipes,
  })

  return (
    <TabPanel value={currentTab} index={1}>
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
                  source: `Forge Recipes are learned by selling resources mined from the field.`,
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
  currentTab: PropTypes.number.isRequired,
  learnedForgeRecipes: PropTypes.array.isRequired,
  setCurrentTab: PropTypes.func.isRequired,
  toolLevels: PropTypes.object.isRequired,
}
