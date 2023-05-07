/** @typedef {import("../../index").farmhand.item} farmhand.item */

import React, { useState } from 'react'
import { object } from 'prop-types'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'

import { items } from '../../img'
import { doesCellarSpaceRemain } from '../../utils/doesCellarSpaceRemain'
import { maxYieldOfFermentationRecipe } from '../../utils/maxYieldOfFermentationRecipe'
import QuantityInput from '../QuantityInput'

import './FermentationRecipe.sass'

/**
 * @param {Object} props
 * @param {farmhand.item} props.item
 */
export const FermentationRecipe = ({ item }) => {
  const fermentationRecipeName = `Fermented ${item.name}`

  // FIXME: Complete this
  const [quantity, setQuantity] = useState(1)

  const canBeMade =
    quantity > 0 && doesCellarSpaceRemain(/* FIXME: Provide args */)

  const handleMakeFermentationRecipe = () => {
    // FIXME: Implement this
  }

  const maxQuantity = maxYieldOfFermentationRecipe()

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
