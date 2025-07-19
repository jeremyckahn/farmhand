import React from 'react'
import classNames from 'classnames'
import Button from '@mui/material/Button/index.js'
import Card from '@mui/material/Card/index.js'
import CardHeader from '@mui/material/CardHeader/index.js'
import CardActions from '@mui/material/CardActions/index.js'
import { array, func, number, object } from 'prop-types'

import IngredientsList from '../IngredientsList/index.js'

import { totalIngredientsInRecipe } from '../../utils/totalIngredientsInRecipe.js'
import { canMakeRecipe, doesInventorySpaceRemain } from '../../utils/index.js'

import { craftedItems } from '../../img/index.js'

import FarmhandContext from '../Farmhand/Farmhand.context.js'
import './UpgradePurchase.sass'
import { INFINITE_STORAGE_LIMIT } from '../../constants.js'

export function UpgradePurchase({
  handleUpgradeTool,
  inventory,
  inventoryLimit,
  playerInventoryQuantities,
  upgrade,
}) {
  const { id, name, description } = upgrade

  const spaceFreedByIngredientsConsumed = totalIngredientsInRecipe(upgrade)

  const canBeMade =
    canMakeRecipe(upgrade, inventory, 1) &&
    // @ts-expect-error
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
          avatar: <img {...{ src: craftedItems[id], alt: name }} />,
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
