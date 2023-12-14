import React from 'react'
import { number, array } from 'prop-types'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import ReactMarkdown from 'react-markdown'

import { recipeType } from '../../enums'
import { recipeCategories } from '../../data/maps'
import { RecipeList } from '../RecipeList/RecipeList'

import { TabPanel } from './TabPanel'

export function KitchenTabPanel({ currentTab, index, learnedKitchenRecipes }) {
  return (
    <TabPanel value={currentTab} index={index}>
      <RecipeList
        learnedRecipes={learnedKitchenRecipes}
        allRecipes={recipeCategories[recipeType.KITCHEN]}
      />
      <Divider />
      <ul className="card-list">
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
  )
}

KitchenTabPanel.propTypes = {
  currentTab: number.isRequired,
  index: number.isRequired,
  learnedKitchenRecipes: array.isRequired,
}
