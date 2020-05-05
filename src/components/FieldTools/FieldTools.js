import React from 'react'
import { array, string } from 'prop-types'

import FarmhandContext from '../../Farmhand.context'
import Item from '../Item'
import './FieldTools.sass'

export const FieldTools = ({ fieldToolInventory, selectedItemId }) => (
  <div className="FieldTools">
    <ul className="card-list">
      {fieldToolInventory.map(item => (
        <li key={item.id}>
          <Item
            {...{
              item,
              isSelected: selectedItemId === item.id,
              isSelectView: true,
            }}
          />
        </li>
      ))}
    </ul>
  </div>
)

FieldTools.propTypes = {
  fieldToolInventory: array.isRequired,
  selectedItemId: string.isRequired,
}

export default function Consumer() {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <FieldTools {...{ ...gameState, ...handlers }} />
      )}
    </FarmhandContext.Consumer>
  )
}
