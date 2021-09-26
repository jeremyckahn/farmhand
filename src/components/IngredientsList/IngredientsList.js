import React from 'react'
import classNames from 'classnames'
import { object, shape, string } from 'prop-types'

import { integerString } from '../../utils'
import { itemsMap } from '../../data/maps'
import AnimatedNumber from '../AnimatedNumber'

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
                playerInventoryQuantities[itemId] >= ingredients[itemId]
                  ? 'in-stock'
                  : 'out-of-stock'
              ),
            }}
          >
            {ingredients[itemId]} x {itemsMap[itemId].name} (On hand:{' '}
            <AnimatedNumber
              {...{
                number: playerInventoryQuantities[itemId],
                formatter: integerString,
              }}
            />
            )
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
