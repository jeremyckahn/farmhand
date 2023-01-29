import React from 'react'
import classNames from 'classnames'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import { array, func, number, object } from 'prop-types'

import IngredientsList from '../IngredientsList'

import {
  canMakeRecipe,
  doesInventorySpaceRemain,
  totalIngredientsInRecipe,
} from '../../utils'

import { craftedItems } from '../../img'

import FarmhandContext from '../Farmhand/Farmhand.context'
import './UpgradePurchase.sass'
import { INFINITE_STORAGE_LIMIT } from '../../constants'

export function UpgradePurchase({
  handleUpgradeTool,
  inventory,
  inventoryLimit,
  playerInventoryQuantities,
  upgrade,
}) {
  const { playerId, name, description } = upgrade

  const spaceFreedByIngredientsConsumed = totalIngredientsInRecipe(upgrade)

  const canBeMade =
    canMakeRecipe(upgrade, inventory, 1) &&
    doesInventorySpaceRemain({
      inventory,
      // Without the Infinity coercion, this would break recipes for unlimited
      // inventoryLimits.
      inventoryLimit:
        (inventoryLimit === INFINITE_STORAGE_LIMIT
          ? Infinity
          : inventoryLimit) + spaceFreedByIngredientsConsumed,
    })

  const handleUpgrade = () => handleUpgradeTool(upgrade)

  return (
    <Card
      {...{
        className: classNames('Recipe', { 'can-be-made': canBeMade }),
      }}
    >
      <CardHeader
        {...{
          avatar: <img {...{ src: craftedItems[playerId], alt: name }} />,
          title: name,
          subheader: (
            <>
              <p>{description}</p>
              <IngredientsList
                {...{ playerInventoryQuantities, recipe: upgrade }}
              />
            </>
          ),
        }}
      />

      <CardActions>
        <Button
          color="primary"
          onClick={handleUpgrade}
          variant="contained"
          disabled={!canBeMade}
        >
          Upgrade Tool
        </Button>
      </CardActions>
    </Card>
  )
}

UpgradePurchase.propTypes = {
  handleUpgradeTool: func.isRequired,
  inventory: array.isRequired,
  inventoryLimit: number.isRequired,
  playerInventoryQuantities: object.isRequired,
  toolLevels: object,
  upgrade: object,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <UpgradePurchase {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
