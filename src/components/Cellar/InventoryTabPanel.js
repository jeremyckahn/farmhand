import React from 'react'
import { number } from 'prop-types'
import Divider from '@material-ui/core/Divider'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import ReactMarkdown from 'react-markdown'

import { TabPanel } from './TabPanel'

// TODO: Consider displaying cellar inventory in the sidebar

export const InventoryTabPanel = ({ index, currentTab }) => (
  <TabPanel value={currentTab} index={index}>
    {/* TODO: Show keg inventory here */}
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
                  'This is your inventory of cellar recipes. Cellar recipes take time to reach maturity until they can be sold. Once they reach maturity, they become higher in quality and value as time passes.',
              }}
            />
          </CardContent>
        </Card>
      </li>
    </ul>
  </TabPanel>
)

InventoryTabPanel.propTypes = {
  currentTab: number.isRequired,
  index: number.isRequired,
}
