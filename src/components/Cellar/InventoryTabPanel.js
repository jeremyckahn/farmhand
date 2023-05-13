/** @typedef {import("../../index").farmhand.keg} keg */
import React, { useContext } from 'react'
import { number } from 'prop-types'
import Divider from '@material-ui/core/Divider'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import ReactMarkdown from 'react-markdown'

import FarmhandContext from '../Farmhand/Farmhand.context'

import { TabPanel } from './TabPanel'
import { Keg } from './Keg'

/**
 * @param {Object} props
 * @param {number} props.index
 * @param {number} props.currentTab
 */
export const InventoryTabPanel = ({ index, currentTab }) => {
  /**
   * @type {{
   *   gameState: {
   *     cellarInventory:Array.<keg>
   *   }
   * }}
   */
  const {
    gameState: { cellarInventory },
  } = useContext(FarmhandContext)

  return (
    <TabPanel value={currentTab} index={index}>
      <ul className="card-list">
        {cellarInventory.map((keg, i) => {
          return (
            <li key={`${i}-${keg.itemId}-${keg.daysUntilFermented}`}>
              <Keg keg={keg} />
            </li>
          )
        })}
      </ul>
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
                    'This is your inventory of cellar kegs. Keg contents take time to reach maturity until they can be sold. Once they reach maturity, they become higher in quality and value as time passes.',
                }}
              />
            </CardContent>
          </Card>
        </li>
      </ul>
    </TabPanel>
  )
}

InventoryTabPanel.propTypes = {
  currentTab: number.isRequired,
  index: number.isRequired,
}
