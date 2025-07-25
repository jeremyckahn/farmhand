import React from 'react'
import { object } from 'prop-types'
import Divider from '@mui/material/Divider/index.js'

import { itemsMap } from '../../data/maps.js'
import FarmhandContext from '../Farmhand/Farmhand.context.js'
import Item from '../Item/index.js'

const PriceEventView = ({ priceCrashes, priceSurges }) => (
  <div className="PriceEventView">
    <h3>Price Surges</h3>
    <ul className="card-list">
      {Object.keys(priceSurges).map(itemId => (
        <li {...{ key: itemId }}>
          <Item
            {...{
              isSellView: true,
              item: itemsMap[itemId],
              showQuantity: true,
            }}
          />
        </li>
      ))}
    </ul>
    <Divider />
    <h3>Price Crashes</h3>
    <ul className="card-list">
      {Object.keys(priceCrashes).map(itemId => (
        <li {...{ key: itemId }}>
          <Item
            {...{
              item: itemsMap[itemId],
            }}
          />
        </li>
      ))}
    </ul>
  </div>
)

PriceEventView.propTypes = {
  priceCrashes: object.isRequired,
  priceSurges: object.isRequired,
}

export { PriceEventView }

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <PriceEventView {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
