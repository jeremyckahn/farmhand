/** @typedef {import("../../index").farmhand.keg} keg */
import React, { useContext } from 'react'
import { object } from 'prop-types'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'

import { itemsMap } from '../../data/maps'
import { items } from '../../img'

import './Keg.sass'
import FarmhandContext from '../Farmhand/Farmhand.context'

/**
 * @param {Object} props
 * @param {keg} props.keg
 */
export function Keg({ keg }) {
  /**
   * @type {{
   *   handlers: {
   *     handleSellKegClick: function(keg): void
   *   }
   * }}
   */
  const {
    handlers: { handleSellKegClick },
  } = useContext(FarmhandContext)

  const item = itemsMap[keg.itemId]
  const fermentationRecipeName = `Fermented ${item.name}`

  const handleSellRecipeClick = () => {
    handleSellKegClick(item)
  }

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
        subheader={<p>Days until ready: {keg.daysUntilMature}</p>}
      ></CardHeader>
      <CardActions>
        <Button
          {...{
            className: 'make-recipe',
            color: 'primary',
            onClick: handleSellRecipeClick,
            variant: 'contained',
          }}
        >
          Sell
        </Button>
      </CardActions>
    </Card>
  )
}

Keg.propTypes = {
  keg: object.isRequired,
}
