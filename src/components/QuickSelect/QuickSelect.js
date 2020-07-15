import React from 'react'
import { array, func, string } from 'prop-types'
import Button from '@material-ui/core/Button'
import classNames from 'classnames'

import FarmhandContext from '../../Farmhand.context'
import { items, pixel } from '../../img'
import { sortItems } from '../../utils'
import Toolbelt from '../Toolbelt'

import './QuickSelect.sass'

const QuickSelect = ({
  fieldToolInventory,
  handleItemSelectClick,
  plantableCropInventory,
  selectedItemId,
}) => (
  <div className="QuickSelect">
    <div {...{ className: 'wrapper' }}>
      <Toolbelt />
      <div {...{ className: 'button-array' }}>
        {[
          ...sortItems(plantableCropInventory),
          ...sortItems(fieldToolInventory),
        ].map(item => (
          <Button
            {...{
              className: classNames({
                'is-selected': item.id === selectedItemId,
              }),
              key: item.id,
              color: 'primary',
              onClick: () => handleItemSelectClick(item),
              variant: item.id === selectedItemId ? 'contained' : 'outlined',
            }}
          >
            <img
              alt={item.name}
              {...{
                className: 'square',
                src: pixel,
                style: { backgroundImage: `url(${items[item.id]}` },
              }}
            />
          </Button>
        ))}
      </div>
    </div>
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
