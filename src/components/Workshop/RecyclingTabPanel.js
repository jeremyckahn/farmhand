import React from 'react'
import PropTypes from 'prop-types'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Divider from '@material-ui/core/Divider'
import ReactMarkdown from 'react-markdown'

import { recipeType } from '../../enums'
import { recipeCategories } from '../../data/maps'
import { RecipeList } from '../RecipeList/RecipeList'

import { TabPanel } from './TabPanel'

export function RecyclingTabPanel({ currentTab, index, learnedRecipes }) {
  return (
    <TabPanel value={currentTab} index={index}>
      <RecipeList
        learnedRecipes={learnedRecipes}
        allRecipes={recipeCategories[recipeType.RECYCLING]}
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
                  source: `Recyling recipes are learned by selling items foraged from the field.`,
                }}
              />
            </CardContent>
          </Card>
        </li>
      </ul>
    </TabPanel>
  )
}

RecyclingTabPanel.propTypes = {
  currentTab: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  learnedRecipes: PropTypes.array.isRequired,
  setCurrentTab: PropTypes.func.isRequired,
}
