import React from 'react'
import { object } from 'prop-types'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'

import { itemsMap } from '../../data/maps'
import { items } from '../../img'
import QuantityInput from '../QuantityInput'

import './Keg.sass'

export function Keg({ keg }) {
  const item = itemsMap[keg.itemId]
  const fermentationRecipeName = `Fermented ${item.name}`

  return (
    <Card className="Keg">
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
        subheader={<p>Days until fermented: {keg.daysUntilFermented}</p>}
      ></CardHeader>
      <CardActions>
        <Button
          {...{
            className: 'make-recipe',
            color: 'primary',
            onClick: () => {
              /* FIXME */
            },
            variant: 'contained',
          }}
        >
          Make
        </Button>
        <QuantityInput
          {...{
            handleSubmit: () => {},
            handleUpdateNumber: () => {},
            maxQuantity: -1,
            setQuantity: () => {},
            value: -1,
          }}
        />
      </CardActions>
    </Card>
  )
}

Keg.propTypes = {
  keg: object.isRequired,
}
