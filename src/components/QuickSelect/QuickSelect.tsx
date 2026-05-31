import React from 'react'
import { array, func, object, string } from 'prop-types'
import Button from '@mui/material/Button/index.js'
import Divider from '@mui/material/Divider/index.js'
import Grid from '@mui/material/Grid/index.js'
import Paper from '@mui/material/Paper/index.js'
import Tooltip from '@mui/material/Tooltip/index.js'
import Typography from '@mui/material/Typography/index.js'
import classNames from 'classnames'

import FarmhandContext from '../Farmhand/Farmhand.context.js'
import { items as itemImages, pixel } from '../../img/index.js'
import { integerString, sortItems } from '../../utils/index.js'
import Toolbelt from '../Toolbelt/index.js'

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
        followCursor
        {...{
          key: item.id,
          placement: 'top',
          title: <Typography>{item.name}</Typography>,
        }}
      >
        <Button
          {...{
            className: classNames({
              'is-selected': item.id === selectedItemId,
            }),
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
