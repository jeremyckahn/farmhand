import React, { Component } from 'react'
import classNames from 'classnames'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import { array, func, node, number, string, object } from 'prop-types'

import { IngredientsList } from '../Recipe/Recipe'

import { canMakeRecipe, doesInventorySpaceRemain } from '../../utils'

import { craftedItems } from '../../img'

import FarmhandContext from '../../Farmhand.context'
import './UpgradePurchase.sass'

export class UpgradePurchase extends Component {
  render() {
    const {
      handleUpgradeTool,
      inventory,
      inventoryLimit,
      playerInventoryQuantities,
      upgrade,
    } = this.props

    const { id, name } = upgrade

    const spaceFreedByIngredientsConsumed = Object.values(
      upgrade.ingredients
    ).reduce((acc, quantity) => acc + quantity, 0)

    const canBeMade =
      canMakeRecipe(upgrade, inventory, 1) &&
      doesInventorySpaceRemain({
        inventory,
        // Without the Infinity coercion, this would break recipes for unlimited
        // inventoryLimits.
        inventoryLimit:
          (inventoryLimit === -1 ? Infinity : inventoryLimit) +
          spaceFreedByIngredientsConsumed,
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
                <p>Increases crop yield</p>
                <IngredientsList
                  {...{ playerInventoryQuantities, recipe: upgrade }}
                />
              </>
            ),
          }}
        />

        <CardActions>
          <Button color="primary" onClick={handleUpgrade} variant="contained">
            Upgrade Tool
          </Button>
        </CardActions>
      </Card>
    )
  }
}

UpgradePurchase.propTypes = {
  description: string,
  handleUpgradeTool: func.isRequired,
  inventory: array.isRequired,
  inventoryLimit: number.isRequired,
  maxedOutPlaceholder: node,
  money: number.isRequired,
  playerInventoryQuantities: object.isRequired,
  title: string.isRequired,
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
