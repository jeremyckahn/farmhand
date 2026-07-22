import React from 'react'
import { number } from 'prop-types'
import Divider from '@mui/material/Divider/index.js'
import Card from '@mui/material/Card/index.js'
import CardContent from '@mui/material/CardContent/index.js'
import ReactMarkdown from 'react-markdown'

import { VinegarRecipeList } from '../VinegarRecipeList/VinegarRecipeList.js'

import { TabPanel } from './TabPanel/index.js'

export const VinegarMakingTabPanel = ({
  index,
  currentTab,
}: {
  index: number
  currentTab: number
}) => (
  <TabPanel value={currentTab} index={index}>
    <VinegarRecipeList />
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
                  'Some crafted goods can be turned into vinegar. Vinegar becomes very valuable in time and never spoils.',
              }}
            />
          </CardContent>
        </Card>
      </li>
    </ul>
  </TabPanel>
)

VinegarMakingTabPanel.propTypes = {
  currentTab: number.isRequired,
  index: number.isRequired,
}
