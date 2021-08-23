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
import { forgeRecipesMap, kitchenRecipesMap } from '../../data/maps'
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
  const learnedForgeRecipes = Object.keys(learnedRecipes).filter(
    recipe => recipe in forgeRecipesMap
  ).length
  const learnedKitchenRecipes = Object.keys(learnedRecipes).filter(
    recipe => recipe in kitchenRecipesMap
  ).length

  return (
    <div className="Workshop">
      <AppBar position="static" color="primary">
        <Tabs
          value={currentTab}
          onChange={(e, newTab) => setCurrentTab(newTab)}
          aria-label="Workshop tabs"
        >
          <Tab label="Kitchen" {...a11yProps(0)} />
          {features.MINING && <Tab label="Forge" {...a11yProps(1)} />}
        </Tabs>
      </AppBar>
      <TabPanel value={currentTab} index={0}>
        <h3>
          Learned Recipes ({learnedKitchenRecipes} /{' '}
          {Object.keys(kitchenRecipesMap).length})
        </h3>
        <ul className="card-list">
          {Object.keys(learnedRecipes).map(recipeId => (
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
          Learned Recipes ({learnedForgeRecipes} /{' '}
          {Object.keys(forgeRecipesMap).length})
        </h3>
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
