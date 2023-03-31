import React, { useState } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Divider from '@material-ui/core/Divider'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import ReactMarkdown from 'react-markdown'

import { a11yProps, TabPanel } from './TabPanel'

import './Cellar.sass'

export const Cellar = () => {
  const [currentTab, setCurrentTab] = useState(0)
  return (
    <div className="Cellar">
      <AppBar position="static" color="primary">
        <Tabs
          value={currentTab}
          onChange={(_e, newTab) => setCurrentTab(newTab)}
          aria-label="Cellar tabs"
        >
          <Tab {...{ label: 'Fermentation', ...a11yProps(0) }} />
        </Tabs>
      </AppBar>
      <TabPanel value={currentTab} index={0}>
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
    </div>
  )
}

Cellar.propTypes = {}
