/** @typedef {import("../../index").farmhand.item} farmhand.item */
/** @typedef {import("../../index").farmhand.keg} farmhand.keg */

import React, { useContext, useEffect, useState } from 'react'
import { object } from 'prop-types'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'

import { PURCHASEABLE_CELLARS } from '../../constants'
import { items } from '../../img'
import { doesCellarSpaceRemain } from '../../utils/doesCellarSpaceRemain'
import { maxYieldOfFermentationRecipe } from '../../utils/maxYieldOfFermentationRecipe'
import QuantityInput from '../QuantityInput'
import FarmhandContext from '../Farmhand/Farmhand.context'
import './FermentationRecipe.sass'

/**
 * @param {Object} props
 * @param {farmhand.item} props.item
 */
export const FermentationRecipe = ({ item }) => {
  /**
   * @type {{
   *   gameState: {
   *     inventory: Array.<farmhand.item>,
   *     cellarInventory: Array.<farmhand.keg>,
   *     purchasedCellar: number,
   *     inventoryLimit: number
   *   }
   * }}
   */
  const {
    gameState: { inventory, cellarInventory, purchasedCellar, inventoryLimit },
  } = useContext(FarmhandContext)

  const fermentationRecipeName = `Fermented ${item.name}`

  const [quantity, setQuantity] = useState(1)

  const { space: cellarSize } = PURCHASEABLE_CELLARS.get(purchasedCellar)

  useEffect(() => {
    setQuantity(
      Math.min(
        maxYieldOfFermentationRecipe(
          item,
          inventory,
          cellarInventory,
          cellarSize,
          inventoryLimit
        ),
        Math.max(1, quantity)
      )
    )
  }, [cellarInventory, cellarSize, inventory, inventoryLimit, item, quantity])

  const canBeMade =
    quantity > 0 && doesCellarSpaceRemain(/* FIXME: Provide args */)

  const handleMakeFermentationRecipe = () => {
    // FIXME: Implement this
  }

  const maxQuantity = maxYieldOfFermentationRecipe(
    item,
    inventory,
    cellarInventory,
    cellarSize,
    inventoryLimit
  )

  return (
    <Card className="FermentationRecipe">
      <CardHeader
        title={fermentationRecipeName}
        avatar={
          <img
            {...{
              src: items[item.id],
            }}
            alt={fermentationRecipeName}
          />
        }
        subheader={
          <>
            <p>Days to ferment: {item.daysToFerment}</p>
            {/* FIXME: Implement this */}
            <p>Units of salt required: </p>
            {/* FIXME: Implement this */}
            <p>In cellar: </p>
          </>
        }
      ></CardHeader>
      <CardActions>
        <Button
          {...{
            className: 'make-recipe',
            color: 'primary',
            disabled: !canBeMade || !quantity,
            onClick: handleMakeFermentationRecipe,
            variant: 'contained',
          }}
        >
          Make
        </Button>
        <QuantityInput
          {...{
            handleSubmit: handleMakeFermentationRecipe,
            handleUpdateNumber: setQuantity,
            maxQuantity,
            setQuantity,
            value: quantity,
          }}
        />
      </CardActions>
    </Card>
  )
}

FermentationRecipe.propTypes = {
  item: object.isRequired,
}
