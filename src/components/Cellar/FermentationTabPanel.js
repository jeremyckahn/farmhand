import React from 'react'
import Divider from '@material-ui/core/Divider'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import ReactMarkdown from 'react-markdown'

import { TabPanel } from './TabPanel'

export const FermentationTabPanel = props => (
  <TabPanel value={props.currentTab} index={0}>
    {/* Recipe list goes here... */}
    <Divider />
    <ul className="card-list">
      <li>
        <Card>
          <CardContent>
            <ReactMarkdown
              {...{
                linkTarget: '_blank',
                className: 'markdown',
                source: `Fermentation recipes are learned by selling crops. Sell as much as you can of a wide variety of items!`,
              }}
            />
          </CardContent>
        </Card>
      </li>
    </ul>
  </TabPanel>
)
