/** @typedef {import("../../index").farmhand.item} item */
/** @typedef {import("../../index").farmhand.keg} keg */

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
import { getSaltRequirementsForFermentationRecipe } from '../../utils/getSaltRequirementsForFermentationRecipe'
import { getFermentedRecipeName } from '../../utils/getFermentedRecipeName'
import QuantityInput from '../QuantityInput'
import FarmhandContext from '../Farmhand/Farmhand.context'
import { itemsMap } from '../../data/maps'

import './FermentationRecipe.sass'
import { getInventoryQuantityMap } from '../../utils/getInventoryQuantityMap'
import { integerString } from '../../utils'
import AnimatedNumber from '../AnimatedNumber'

/**
 * @param {Object} props
 * @param {item} props.item
 */
export const FermentationRecipe = ({ item }) => {
  /**
   * @type {{
   *   gameState: {
   *     inventory: Array.<item>,
   *     cellarInventory: Array.<keg>,
   *     purchasedCellar: number
   *   },
   *   handlers: {
   *     handleMakeFermentationRecipeClick: function(item, number)
   *   }
   * }}
   */
  const {
    gameState: { inventory, cellarInventory, purchasedCellar },
    handlers: { handleMakeFermentationRecipeClick },
  } = useContext(FarmhandContext)

  const [quantity, setQuantity] = useState(1)

  const inventoryQuantityMap = getInventoryQuantityMap(inventory)
  const fermentationRecipeName = getFermentedRecipeName(item)
  const { space: cellarSize } = PURCHASEABLE_CELLARS.get(purchasedCellar)

  useEffect(() => {
    setQuantity(
      Math.min(
        maxYieldOfFermentationRecipe(
          item,
          inventory,
          cellarInventory,
          cellarSize
        ),
        Math.max(1, quantity)
      )
    )
  }, [cellarInventory, cellarSize, inventory, item, quantity])

  const canBeMade =
    quantity > 0 && doesCellarSpaceRemain(cellarInventory, purchasedCellar)

  const handleMakeFermentationRecipe = () => {
    if (canBeMade) {
      handleMakeFermentationRecipeClick(item, quantity)
    }
  }

  const maxQuantity = maxYieldOfFermentationRecipe(
    item,
    inventory,
    cellarInventory,
    cellarSize
  )

  // TODO: Memoize this
  const recipeInstancesInCellar = cellarInventory.reduce((acc, keg) => {
    if (keg.itemId === item.id) {
      acc++
    }

    return acc
  }, 0)

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
            <p>
              Units of {itemsMap.salt.name} required:{' '}
              {getSaltRequirementsForFermentationRecipe(item)} (on hand:{' '}
              <AnimatedNumber
                {...{
                  number: inventoryQuantityMap[itemsMap.salt.id],
                  formatter: integerString,
                }}
              />
              )
            </p>
            <p>In cellar: {recipeInstancesInCellar}</p>
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
