/** @typedef {import("../../index").farmhand.keg} keg */
import React, { useContext } from 'react'
import { number } from 'prop-types'
import Divider from '@mui/material/Divider'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import ReactMarkdown from 'react-markdown'

import FarmhandContext from '../Farmhand/Farmhand.context'
import { KEG_INTEREST_RATE, PURCHASEABLE_CELLARS } from '../../constants'

import { integerString } from '../../utils'

import { TabPanel } from './TabPanel'
import { Keg } from './Keg'

/**
 * @param {Object} props
 * @param {number} props.index
 * @param {number} props.currentTab
 */
export const CellarInventoryTabPanel = ({ index, currentTab }) => {
  /**
   * @type {{
   *   gameState: {
   *     cellarInventory:Array.<keg>,
   *     purchasedCellar: number
   *   }
   * }}
   */
  const {
    gameState: { cellarInventory, purchasedCellar },
  } = useContext(FarmhandContext)

  return (
    <TabPanel value={currentTab} index={index}>
      <h3>
        Capacity: {integerString(cellarInventory.length)} /{' '}
        {integerString(PURCHASEABLE_CELLARS.get(purchasedCellar).space)}
      </h3>
      <ul className="card-list">
        {cellarInventory.map(keg => (
          <li key={keg.id}>
            <Keg keg={keg} />
          </li>
        ))}
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
                  source: `This is your inventory of cellar kegs. Keg contents take time to reach maturity before they can be sold. Once they reach maturity, keg contents become higher in quality and their value compounds at a rate of ${KEG_INTEREST_RATE}% a day.`,
                }}
              />
            </CardContent>
          </Card>
        </li>
      </ul>
    </TabPanel>
  )
}

CellarInventoryTabPanel.propTypes = {
  currentTab: number.isRequired,
  index: number.isRequired,
}
