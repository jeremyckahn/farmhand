import React from 'react'
import { array, func, object, string } from 'prop-types'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Tooltip from '@material-ui/core/Tooltip'
import classNames from 'classnames'

import FarmhandContext from '../Farmhand/Farmhand.context'
import { items as itemImages, pixel } from '../../img'
import { integerString, sortItems } from '../../utils'
import Toolbelt from '../Toolbelt'

import './QuickSelect.sass'

const ItemList = ({
  handleItemSelectClick,
  items,
  playerInventoryQuantities,
  selectedItemId,
}) => (
  <div {...{ className: 'button-array' }}>
    {sortItems(items).map(item => (
      <Tooltip
        {...{
          key: item.playerId,
          placement: 'top',
          title: item.name,
        }}
      >
        <Button
          {...{
            className: classNames({
              'is-selected': item.playerId === selectedItemId,
            }),
            color: 'primary',
            onClick: () => handleItemSelectClick(item),
            variant: item.playerId === selectedItemId ? 'contained' : 'text',
          }}
        >
          <img
            alt={item.name}
            {...{
              className: 'square',
              src: pixel,
              style: { backgroundImage: `url(${itemImages[item.playerId]}` },
            }}
          />
          <p {...{ className: 'quantity' }}>
            {integerString(playerInventoryQuantities[item.playerId])}
          </p>
        </Button>
      </Tooltip>
    ))}
  </div>
)

ItemList.propTypes = {
  handleItemSelectClick: func,
  items: array.isRequired,
  playerInventoryQuantities: object.isRequired,
  selectedItemId: string.isRequired,
}

const QuickSelect = ({
  fieldToolInventory,
  handleItemSelectClick,
  playerInventoryQuantities,
  plantableCropInventory,
  selectedItemId,
}) => (
  <Paper {...{ className: 'QuickSelect', elevation: 10 }}>
    <Grid {...{ container: true, alignItems: 'center', wrap: 'nowrap' }}>
      <Toolbelt />
      {plantableCropInventory.length > 0 && (
        <>
          <Divider orientation="vertical" flexItem />
          <ItemList
            {...{
              handleItemSelectClick,
              items: plantableCropInventory,
              playerInventoryQuantities,
              selectedItemId,
            }}
          />
        </>
      )}

      {fieldToolInventory.length > 0 && (
        <>
          <Divider orientation="vertical" flexItem />
          <ItemList
            {...{
              handleItemSelectClick,
              items: fieldToolInventory,
              playerInventoryQuantities,
              selectedItemId,
            }}
          />
        </>
      )}
    </Grid>
  </Paper>
)

QuickSelect.propTypes = {
  fieldToolInventory: array.isRequired,
  handleItemSelectClick: func,
  plantableCropInventory: array.isRequired,
  playerInventoryQuantities: object.isRequired,
  selectedItemId: string.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <QuickSelect {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
