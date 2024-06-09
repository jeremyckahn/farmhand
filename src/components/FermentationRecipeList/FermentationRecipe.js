/**
 * @typedef {import("../../index").farmhand.item} item
 * @typedef {import("../../index").farmhand.keg} keg
 */

import React, { useContext, useEffect, useState } from 'react'
import { object } from 'prop-types'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'

import { PURCHASEABLE_CELLARS } from '../../constants'
import { items } from '../../img'
import { getMaxYieldOfFermentationRecipe } from '../../utils/getMaxYieldOfFermentationRecipe'
import { getSaltRequirementsForFermentationRecipe } from '../../utils/getSaltRequirementsForFermentationRecipe'
import { FERMENTED_CROP_NAME } from '../../templates'
import QuantityInput from '../QuantityInput'
import FarmhandContext from '../Farmhand/Farmhand.context'
import { itemsMap } from '../../data/maps'
import { cellarService } from '../../services/cellar'
import { getInventoryQuantityMap } from '../../utils/getInventoryQuantityMap'
import { integerString } from '../../utils'
import AnimatedNumber from '../AnimatedNumber'

import './FermentationRecipe.sass'

/**
 * @param {Object} props
 * @param {item} props.item
 */
export const FermentationRecipe = ({ item }) => {
  const {
    gameState: { inventory, cellarInventory, purchasedCellar },
    handlers: { handleMakeFermentationRecipeClick },
  } = useContext(FarmhandContext)

  const [quantity, setQuantity] = useState(1)

  const inventoryQuantityMap = getInventoryQuantityMap(inventory)
  // @ts-expect-error
  const fermentationRecipeName = FERMENTED_CROP_NAME`${item}`
  const { space: cellarSize } = PURCHASEABLE_CELLARS.get(purchasedCellar) ?? {
    space: 0,
  }

  useEffect(() => {
    setQuantity(
      Math.min(
        getMaxYieldOfFermentationRecipe(
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
    quantity > 0 &&
    cellarService.doesCellarSpaceRemain(cellarInventory, purchasedCellar)

  const handleMakeFermentationRecipe = () => {
    if (canBeMade) {
      handleMakeFermentationRecipeClick(item, quantity)
    }
  }

  const maxQuantity = getMaxYieldOfFermentationRecipe(
    item,
    inventory,
    cellarInventory,
    cellarSize
  )

  const recipeInstancesInCellar = cellarService.getItemInstancesInCellar(
    cellarInventory,
    item
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
            <p>
              Units of {itemsMap[item.id].name} in inventory:{' '}
              {integerString(inventoryQuantityMap[item.id] ?? 0)}
            </p>
            <p>
              Units of {itemsMap.salt.name} required:{' '}
              {getSaltRequirementsForFermentationRecipe(item)} (available:{' '}
              <AnimatedNumber
                {...{
                  number: inventoryQuantityMap[itemsMap.salt.id] ?? 0,
                  formatter: integerString,
                }}
              />
              )
            </p>
            <p>In cellar: {integerString(recipeInstancesInCellar ?? 0)}</p>
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
