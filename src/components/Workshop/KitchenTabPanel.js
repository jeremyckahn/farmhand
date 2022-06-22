import React from 'react'
import PropTypes from 'prop-types'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Divider from '@material-ui/core/Divider'
import ReactMarkdown from 'react-markdown'

import { recipeType } from '../../enums'

import { recipeCategories } from '../../data/maps'

import { TabPanel } from './TabPanel'
import { RecipeList } from './RecipeList'

export function KitchenTabPanel({
  currentTab,
  setCurrentTab,
  learnedKitchenRecipes,
}) {
  return (
    <TabPanel value={currentTab} index={0}>
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
  currentTab: PropTypes.number.isRequired,
  setCurrentTab: PropTypes.func.isRequired,
  learnedKitchenRecipes: PropTypes.array.isRequired,
}
