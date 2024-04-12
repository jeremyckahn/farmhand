import React from 'react'
import { number } from 'prop-types'
import Divider from '@mui/material/Divider'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import ReactMarkdown from 'react-markdown'

import { TabPanel } from './TabPanel'

export const WinemakingTabPanel = ({ index, currentTab }) => (
  <TabPanel value={currentTab} index={index}>
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
                  'Grapes can be made into wine. Wine becomes very valuable in time and never spoils.',
              }}
            />
          </CardContent>
        </Card>
      </li>
    </ul>
  </TabPanel>
)

WinemakingTabPanel.propTypes = {
  currentTab: number.isRequired,
  index: number.isRequired,
}
