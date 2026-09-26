import React from 'react'
import { number, array } from 'prop-types'

import Card from '@mui/material/Card/index.js'
import CardContent from '@mui/material/CardContent/index.js'
import Divider from '@mui/material/Divider/index.js'

import { Markdown } from '../Markdown/index.js'

import { recipeType } from '../../enums.js'
import { recipeCategories } from '../../data/maps.js'
import { RecipeList } from '../RecipeList/RecipeList.js'

import { TabPanel } from './TabPanel/index.js'

interface RecyclingTabPanelProps {
  currentTab: number
  index: number
  learnedRecipes: string[]
}

export function RecyclingTabPanel({
  currentTab,
  index,
  learnedRecipes,
}: RecyclingTabPanelProps) {
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
              <Markdown
                {...{
                  children: `Recyling recipes are learned by selling items foraged from the field.`,
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
