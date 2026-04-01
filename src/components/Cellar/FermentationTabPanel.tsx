import React from 'react'
import { number } from 'prop-types'
import Divider from '@mui/material/Divider/index.js'
import Card from '@mui/material/Card/index.js'
import CardContent from '@mui/material/CardContent/index.js'
import ReactMarkdown from 'react-markdown'

import { FermentationRecipeList } from '../FermentationRecipeList/FermentationRecipeList.js'

import { TabPanel } from './TabPanel/index.js'

export const FermentationTabPanel = ({ index, currentTab }) => (
  <TabPanel value={currentTab} index={index}>
    <FermentationRecipeList />
    <Divider />
    <ul className="card-list">
      <li>
        <Card>
          <CardContent>
            <ReactMarkdown
              {...{
                linkTarget: '_blank',
                className: 'markdown',
                source:
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
