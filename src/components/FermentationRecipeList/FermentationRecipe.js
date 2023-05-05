import React from 'react'
import { object } from 'prop-types'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'

import './FermentationRecipe.sass'

export const FermentationRecipe = ({ item }) => (
  <Card className="FermentationRecipe">
    <CardHeader
      title={item.name}
      avatar={
        <img
          {...{
            src: item[item.id],
          }}
          alt={item.name}
        />
      }
    ></CardHeader>
    <CardContent></CardContent>
    <CardActions></CardActions>
  </Card>
)

FermentationRecipe.propTypes = {
  item: object.isRequired,
}
