import React from 'react'
import { array, func, object, string } from 'prop-types'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import classNames from 'classnames'

import FarmhandContext from '../../Farmhand.context'
import { items as itemImages, pixel } from '../../img'
import { integerString, sortItems } from '../../utils'
import Toolbelt from '../Toolbelt'

import './QuickSelect.sass'

const ItemList = ({
  handleItemSelectClick,
  items,
  playerInventoryQuantities,
  selectedItemId,
}) =>
  sortItems(items).map(item => (
    <Button
      {...{
        className: classNames({
          'is-selected': item.id === selectedItemId,
        }),
        key: item.id,
        color: 'primary',
        onClick: () => handleItemSelectClick(item),
        variant: item.id === selectedItemId ? 'contained' : 'text',
      }}
    >
      <img
        alt={item.name}
        {...{
          className: 'square',
          src: pixel,
          style: { backgroundImage: `url(${itemImages[item.id]}` },
        }}
      />
      <p {...{ className: 'quantity' }}>
        {integerString(playerInventoryQuantities[item.id])}
      </p>
    </Button>
  ))

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
      <Divider orientation="vertical" flexItem />
      <div {...{ className: 'button-array' }}>
        <ItemList
          {...{
            handleItemSelectClick,
            items: plantableCropInventory,
            playerInventoryQuantities,
            selectedItemId,
          }}
        />
      </div>
      <Divider orientation="vertical" flexItem />
      <div {...{ className: 'button-array' }}>
        <ItemList
          {...{
            handleItemSelectClick,
            items: fieldToolInventory,
            playerInventoryQuantities,
            selectedItemId,
          }}
        />
      </div>
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
