import React from 'react'
import { number } from 'prop-types'
import Divider from '@mui/material/Divider'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import ReactMarkdown from 'react-markdown'

import { FermentationRecipeList } from '../FermentationRecipeList/FermentationRecipeList'

import { TabPanel } from './TabPanel'

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
                  'Some items can be fermented. Fermented items become much more valuable over time!',
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
