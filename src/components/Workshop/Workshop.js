import React, { useState } from 'react'
import { object } from 'prop-types'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Divider from '@material-ui/core/Divider'
import ReactMarkdown from 'react-markdown'
import AppBar from '@material-ui/core/AppBar'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'

import { features } from '../../config'
import { recipeType, toolType } from '../../enums'

import * as items from '../../data/items'
import { recipeCategories, recipesMap } from '../../data/maps'
import toolUpgrades from '../../data/upgrades'

import Recipe from '../Recipe'
import UpgradePurchase from '../UpgradePurchase'

import FarmhandContext from '../../Farmhand.context'

import { TabPanel, a11yProps } from './TabPanel'

import './Workshop.sass'

/**
 * @param {Array.<Object.<string, true>>} learnedRecipes
 * @returns {{ learnedKitchenRecipes: Array.<farmhand.recipe>, learnedForgeRecipes: Array.<farmhand.recipe>}}
 */
const getLearnedRecipeCategories = learnedRecipes => {
  const learnedKitchenRecipes = []
  const learnedForgeRecipes = []

  for (const learnedRecipeId of Object.keys(learnedRecipes)) {
    const learnedRecipe = recipesMap[learnedRecipeId]

    switch (learnedRecipe.recipeType) {
      case recipeType.KITCHEN:
        learnedKitchenRecipes.push(learnedRecipe)
        break
      case recipeType.FORGE:
        learnedForgeRecipes.push(learnedRecipe)
        break
      default:
        throw new Error(`Received invalid recipe ID: ${learnedRecipeId}`)
    }
  }

  return { learnedKitchenRecipes, learnedForgeRecipes }
}

const Workshop = ({ learnedRecipes, toolLevels }) => {
  const [currentTab, setCurrentTab] = useState(0)

  const {
    learnedKitchenRecipes,
    learnedForgeRecipes,
  } = getLearnedRecipeCategories(learnedRecipes)

  const upgradeRecipe = {
    id: 'tool-upgrade',
    name: 'Tool Upgrade',
    ingredients: {
      [items.goldOre.id]: 5,
      [items.coal.id]: 10,
    },
    condition: state => true,
    recipeType: recipeType.FORGE,
  }

  const nextLevel =
    toolUpgrades[toolType.SCYTHE][toolLevels[toolType.SCYTHE]].nextLevel
  const scytheUpgrade = toolUpgrades[toolType.SCYTHE][nextLevel]

  return (
    <div className="Workshop">
      <AppBar position="static" color="primary">
        <Tabs
          value={currentTab}
          onChange={(e, newTab) => setCurrentTab(newTab)}
          aria-label="Workshop tabs"
        >
          <Tab {...{ label: 'Kitchen', ...a11yProps(0) }} />
          {features.MINING && <Tab {...{ label: 'Forge', ...a11yProps(1) }} />}
        </Tabs>
      </AppBar>
      <TabPanel value={currentTab} index={0}>
        <h3>
          Learned Recipes ({learnedKitchenRecipes.length} /{' '}
          {Object.keys(recipeCategories[recipeType.KITCHEN]).length})
        </h3>
        <ul className="card-list">
          {learnedKitchenRecipes.map(({ id: recipeId }) => (
            <li key={recipeId}>
              <Recipe
                {...{
                  recipe: recipeCategories[recipeType.KITCHEN][recipeId],
                }}
              />
            </li>
          ))}
        </ul>
        <Divider />
        <ul className="card-list">
          {/*
          This really isn't a list, but it makes it easy to keep the UI
          consistent.
        */}
          <li>
            <Card>
              <CardContent>
                <ReactMarkdown
                  {...{
                    linkTarget: '_blank',
                    className: 'markdown',
                    source: `Recipes are learned by selling crops and animal products. Sell as much as you can of a wide variety of items!`,
                  }}
                />
              </CardContent>
            </Card>
          </li>
        </ul>
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <h3>
          Learned Recipes ({learnedForgeRecipes.length} /{' '}
          {Object.keys(recipeCategories[recipeType.FORGE]).length})
        </h3>
        <ul className="card-list">
          {learnedForgeRecipes.map(({ id: recipeId }) => (
            <li key={recipeId}>
              <Recipe
                {...{
                  recipe: recipeCategories[recipeType.FORGE][recipeId],
                }}
              />
            </li>
          ))}
        </ul>
        <ul className="card-list">
          <li>
            <h4>Tool Upgrades</h4>
          </li>
          <li>
            <UpgradePurchase
              upgrade={scytheUpgrade}
              toolType={toolType.SCYTHE}
              title={scytheUpgrade.name}
              description="Use ore to craft a better scythe"
            />
          </li>
        </ul>
      </TabPanel>
    </div>
  )
}

Workshop.propTypes = {
  learnedRecipes: object.isRequired,
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
