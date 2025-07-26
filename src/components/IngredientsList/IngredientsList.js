import React from 'react'
import classNames from 'classnames'
import { object, shape, string } from 'prop-types'

import { INGREDIENTS_LIST_ITEM } from '../../templates.js'

import { integerString } from '../../utils/index.js'
import { itemsMap } from '../../data/maps.js'

export default function IngredientsList({
  playerInventoryQuantities,
  recipe: { ingredients, name },
}) {
  return (
    <ul {...{ className: 'card-list', title: `Ingredients for ${name}` }}>
      <li>
        <h4>Ingredients required:</h4>
      </li>
      {Object.keys(ingredients).map(itemId => (
        <li {...{ key: itemId }} data-testid="ingredient">
          <p
            {...{
              className: classNames(
                (playerInventoryQuantities[itemId] || 0) >= ingredients[itemId]
                  ? 'in-stock'
                  : 'out-of-stock'
              ),
            }}
          >
            {INGREDIENTS_LIST_ITEM`${ingredients[itemId]}${
              itemsMap[itemId].name
            }${integerString(playerInventoryQuantities[itemId] || 0)}
            `}
          </p>
        </li>
      ))}
    </ul>
  )
}

IngredientsList.propTypes = {
  playerInventoryQuantities: object.isRequired,
  recipe: shape({ ingredients: object.isRequired, name: string.isRequired })
    .isRequired,
}
