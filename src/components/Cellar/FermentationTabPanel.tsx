import React from 'react'
import { number } from 'prop-types'
import Divider from '@mui/material/Divider/index.js'
import Card from '@mui/material/Card/index.js'
import CardContent from '@mui/material/CardContent/index.js'

import { Markdown } from '../Markdown/index.js'

import { FermentationRecipeList } from '../FermentationRecipeList/FermentationRecipeList.js'

import { TabPanel } from './TabPanel/index.js'

export const FermentationTabPanel = ({
  index,
  currentTab,
}: {
  index: number
  currentTab: number
}) => (
  <TabPanel value={currentTab} index={index}>
    <FermentationRecipeList />
    <Divider />
    <ul className="card-list">
      <li>
        <Card>
          <CardContent>
            <Markdown
              {...{
                children:
                  'Some items can be fermented and become much more valuable over time.',
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
}
