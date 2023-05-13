/** @typedef {import("../../index").farmhand.keg} keg */
import React, { useContext } from 'react'
import { number } from 'prop-types'
import Divider from '@material-ui/core/Divider'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import ReactMarkdown from 'react-markdown'

import { itemsMap } from '../../data/maps'
import { items } from '../../img'

import QuantityInput from '../QuantityInput'

import FarmhandContext from '../Farmhand/Farmhand.context'

import { TabPanel } from './TabPanel'

// TODO: Consider displaying cellar inventory in the sidebar

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
      {/* TODO: Show keg inventory here */}
      <ul className="card-list">
        {cellarInventory.map((keg, i) => {
          const item = itemsMap[keg.itemId]
          const fermentationRecipeName = `Fermented ${item.name}`

          return (
            <li key={`${i}-${keg.itemId}-${keg.daysUntilFermented}`}>
              <Card className="Keg">
                <CardHeader
                  title={fermentationRecipeName}
                  avatar={
                    <img
                      {...{
                        src: items[item.id],
                      }}
                      alt={fermentationRecipeName}
                    />
                  }
                  subheader={
                    <>
                      <p>Days until fermented: {keg.daysUntilFermented}</p>
                    </>
                  }
                ></CardHeader>
                <CardActions>
                  <Button
                    {...{
                      className: 'make-recipe',
                      color: 'primary',
                      onClick: () => {
                        /* FIXME */
                      },
                      variant: 'contained',
                    }}
                  >
                    Make
                  </Button>
                  <QuantityInput
                    {...{
                      handleSubmit: () => {},
                      handleUpdateNumber: () => {},
                      maxQuantity: -1,
                      setQuantity: () => {},
                      value: -1,
                    }}
                  />
                </CardActions>
              </Card>
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
