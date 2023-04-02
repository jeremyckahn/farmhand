import React from 'react'
import { number, array } from 'prop-types'
import Divider from '@material-ui/core/Divider'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import ReactMarkdown from 'react-markdown'

import { recipeType } from '../../enums'
import { recipeCategories } from '../../data/maps'
import { RecipeList } from '../RecipeList/RecipeList'

import { TabPanel } from './TabPanel'

export const FermentationTabPanel = ({
  index,
  currentTab,
  learnedFermentationRecipes,
}) => (
  <TabPanel value={currentTab} index={index}>
    <RecipeList
      learnedRecipes={learnedFermentationRecipes}
      allRecipes={recipeCategories[recipeType.FERMENTATION]}
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
                source: `Fermentation recipes are learned by selling crops. Sell as much as you can of a wide variety of items!`,
              }}
            />
          </CardContent>
        </Card>
      </li>
    </ul>
  </TabPanel>
)

FermentationTabPanel.propTypes = {
  currentTab: number.isRequired,
  index: number.isRequired,
  learnedFermentationRecipes: array.isRequired,
}
