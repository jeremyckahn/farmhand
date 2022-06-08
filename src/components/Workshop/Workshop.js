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
import { recipeType } from '../../enums'

import { recipeCategories, recipesMap } from '../../data/maps'
import toolUpgrades from '../../data/upgrades'

import Recipe from '../Recipe'
import UpgradePurchase from '../UpgradePurchase'

import FarmhandContext from '../Farmhand/Farmhand.context'

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

/**
 * Get available upgrades based on current tool levels and unlocked recipes
 * @param {object} toolLevels - the current level of each tool
 * @param {array} learnedRecipes - list of learned recipes from farmhand state
 * @returns {array} a list of all applicable upgrades
 */
const getUpgradesAvailable = (toolLevels, learnedRecipes) => {
  let upgradesAvailable = []
  const learnedRecipeIds = learnedRecipes.map(r => r.id)

  for (let type of Object.keys(toolUpgrades)) {
    let upgrade = toolUpgrades[type][toolLevels[type]]

    if (upgrade && !upgrade.isMaxLevel && upgrade.nextLevel) {
      const nextLevelUpgrade = toolUpgrades[type][upgrade.nextLevel]
      let allIngredientsUnlocked = true

      for (let ingredient of Object.keys(nextLevelUpgrade.ingredients)) {
        allIngredientsUnlocked =
          allIngredientsUnlocked &&
          !!(!recipesMap[ingredient] || learnedRecipeIds.includes(ingredient))
      }

      if (allIngredientsUnlocked) {
        upgradesAvailable.push(nextLevelUpgrade)
      }
    }
  }

  return upgradesAvailable
}

const Workshop = ({ learnedRecipes, purchasedSmelter, toolLevels }) => {
  const [currentTab, setCurrentTab] = useState(0)

  const {
    learnedKitchenRecipes,
    learnedForgeRecipes,
  } = getLearnedRecipeCategories(learnedRecipes)

  const upgradesAvailable = getUpgradesAvailable(
    toolLevels,
    learnedForgeRecipes
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
                    source: `Kitchen recipes are learned by selling crops and animal products. Sell as much as you can of a wide variety of items!`,
                  }}
                />
              </CardContent>
            </Card>
          </li>
        </ul>
      </TabPanel>
      {showForge ? (
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
      ) : null}
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
