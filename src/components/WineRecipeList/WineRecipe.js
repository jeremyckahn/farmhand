import React from 'react'
import { oneOf } from 'prop-types'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'

import {
  grapeVarietyNameMap,
  wineVarietyValueMap,
} from '../../data/crops/grape'
import { grapeVariety } from '../../enums'
import { wines } from '../../img'
import { integerString } from '../../utils'

/**
 * @param {{
 *   wineVariety: grapeVariety
 * }} props
 */
export const WineRecipe = ({ wineVariety }) => {
  const wineName = grapeVarietyNameMap[wineVariety]

  return (
    <Card className="WineRecipe">
      <CardHeader
        title={wineName}
        avatar={
          <img
            {...{
              src: wines[wineVariety],
            }}
            alt={wineName}
          />
        }
        subheader={
          <>
            <p>
              Days to mature:{' '}
              {integerString(3 * wineVarietyValueMap[wineVariety])}
            </p>
            {
              // FIXME: Show type and number of grapes required (4x their wineVarietyValueMap value)
              // FIXME: Show number of required grapes in inventory
              // FIXME: Show amount in cellar
            }
          </>
        }
      ></CardHeader>
      <CardActions>
        <Button color="primary" variant="contained">
          Make
        </Button>
      </CardActions>
    </Card>
  )
}

WineRecipe.propTypes = {
  wineVariety: oneOf(Object.keys(grapeVariety)),
}
