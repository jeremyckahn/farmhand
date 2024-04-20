import React from 'react'
import { oneOf } from 'prop-types'

import { grapeVariety } from '../../enums'

/**
 * @param {{
 *   wineVariety: grapeVariety
 * }} props
 */
export const WineRecipe = ({ wineVariety }) => {
  return <>{wineVariety}</>
}

WineRecipe.propTypes = {
  wineVariety: oneOf(Object.keys(grapeVariety)),
}
