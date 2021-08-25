import React, { useState } from 'react'
import { object, node, number } from 'prop-types'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Divider from '@material-ui/core/Divider'
import ReactMarkdown from 'react-markdown'
import AppBar from '@material-ui/core/AppBar'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'

import { features } from '../../config'
import { recipeType } from '../../enums'
import { forgeRecipesMap, kitchenRecipesMap, recipesMap } from '../../data/maps'
import Recipe from '../Recipe'

import FarmhandContext from '../../Farmhand.context'

import './Workshop.sass'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <section
      role="tabpanel"
      hidden={value !== index}
      id={`workshop-tabpanel-${index}`}
      aria-labelledby={`workshop-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </section>
  )
}

TabPanel.propTypes = {
  children: node,
  index: number.isRequired,
  value: number.isRequired,
}

const a11yProps = index => ({
  id: `workshop-tab-${index}`,
  'aria-controls': `workshop-tabpanel-${index}`,
})

const Workshop = ({ learnedRecipes }) => {
  const [currentTab, setCurrentTab] = useState(0)

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
          {Object.keys(kitchenRecipesMap).length})
        </h3>
        <ul className="card-list">
          {learnedKitchenRecipes.map(({ id: recipeId }) => (
            <li key={recipeId}>
              <Recipe
                {...{
                  recipe: kitchenRecipesMap[recipeId],
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
          {Object.keys(forgeRecipesMap).length})
        </h3>
        <ul className="card-list">
          {learnedForgeRecipes.map(({ id: recipeId }) => (
            <li key={recipeId}>
              <Recipe
                {...{
                  recipe: forgeRecipesMap[recipeId],
                }}
              />
            </li>
          ))}
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
