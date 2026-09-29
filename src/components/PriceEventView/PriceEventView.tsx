import React from 'react'
import Divider from '@mui/material/Divider/index.js'

import { itemsMap } from '../../data/maps.js'
import FarmhandContext from '../Farmhand/Farmhand.context.js'
import Item from '../Item/index.js'

const PriceEventView = ({
  priceCrashes,
  priceSurges,
}: {
  priceCrashes: Record<string, farmhand.priceEvent>
  priceSurges: Record<string, farmhand.priceEvent>
}) => (
  <div className="PriceEventView">
    <h3>Price Surges</h3>
    <ul className="card-list">
      {Object.keys(priceSurges).map(itemId => (
        <li key={itemId}>
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
        <li key={itemId}>
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

export { PriceEventView }

export default function Consumer(
  props: Partial<Parameters<typeof PriceEventView>[0]>
) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <PriceEventView
          {...({
            ...gameState,
            ...handlers,
            ...props,
          } as Parameters<typeof PriceEventView>[0])}
        />
      )}
    </FarmhandContext.Consumer>
  )
}
