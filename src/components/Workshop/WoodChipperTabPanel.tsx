import React from 'react'
import { number, array } from 'prop-types'

import Card from '@mui/material/Card/index.js'
import CardContent from '@mui/material/CardContent/index.js'
import Divider from '@mui/material/Divider/index.js'
import ReactMarkdown from 'react-markdown'

import { recipeType } from '../../enums.js'
import { recipeCategories } from '../../data/maps.js'
import { RecipeList } from '../RecipeList/RecipeList.js'

import { TabPanel } from './TabPanel/index.js'

interface WoodChipperTabPanelProps {
  currentTab: number
  index: number
  learnedRecipes: string[]
}

export function WoodChipperTabPanel({
  currentTab,
  index,
  learnedRecipes,
}: WoodChipperTabPanelProps) {
  return (
    <TabPanel value={currentTab} index={index}>
      <RecipeList
        learnedRecipes={learnedRecipes}
        allRecipes={recipeCategories[recipeType.WOOD_CHIPPER]}
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
                  source: `Wood Chipper recipes are learned by selling wood chopped from trees.`,
                }}
              />
            </CardContent>
          </Card>
        </li>
      </ul>
    </TabPanel>
  )
}

WoodChipperTabPanel.propTypes = {
  currentTab: number.isRequired,
  index: number.isRequired,
  learnedRecipes: array.isRequired,
}
