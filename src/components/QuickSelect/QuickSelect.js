import React from 'react'
import { array, func, string } from 'prop-types'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import classNames from 'classnames'

import FarmhandContext from '../../Farmhand.context'
import { items as itemImages, pixel } from '../../img'
import { sortItems } from '../../utils'
import Toolbelt from '../Toolbelt'

import './QuickSelect.sass'

const ItemList = ({ handleItemSelectClick, items, selectedItemId }) =>
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
    </Button>
  ))

ItemList.propTypes = {
  handleItemSelectClick: func,
  items: array.isRequired,
  selectedItemId: string.isRequired,
}

const QuickSelect = ({
  fieldToolInventory,
  handleItemSelectClick,
  plantableCropInventory,
  selectedItemId,
}) => (
  <div className="QuickSelect">
    <Grid {...{ container: true, alignItems: 'center', wrap: 'nowrap' }}>
      <Toolbelt />
      <Divider orientation="vertical" flexItem />
      <div {...{ className: 'button-array' }}>
        <ItemList
          {...{
            items: plantableCropInventory,
            selectedItemId,
            handleItemSelectClick,
          }}
        />
      </div>
      <Divider orientation="vertical" flexItem />
      <div {...{ className: 'button-array' }}>
        <ItemList
          {...{
            items: fieldToolInventory,
            selectedItemId,
            handleItemSelectClick,
          }}
        />
      </div>
    </Grid>
  </div>
)

QuickSelect.propTypes = {
  fieldToolInventory: array.isRequired,
  handleItemSelectClick: func,
  plantableCropInventory: array.isRequired,
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
