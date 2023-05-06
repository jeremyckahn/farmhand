/** @typedef {import("../../index").farmhand.item} farmhand.item */

import React from 'react'
import { object } from 'prop-types'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'

import { items } from '../../img'

import './FermentationRecipe.sass'

/**
 * @param {Object} props
 * @param {Farmhand.item} props.item
 */
export const FermentationRecipe = ({ item }) => {
  const fermentationRecipeName = `Fermented ${item.name}`

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
          </>
        }
      ></CardHeader>
      <CardContent></CardContent>
      <CardActions></CardActions>
    </Card>
  )
}

FermentationRecipe.propTypes = {
  item: object.isRequired,
}
