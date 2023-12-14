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
  currentTab: number.isRequired,
  index: number.isRequired,
  learnedRecipes: array.isRequired,
}
