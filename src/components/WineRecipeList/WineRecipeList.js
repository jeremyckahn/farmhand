import React, { useContext } from 'react'

import { getWineVarietiesAvailableToMake } from '../../utils/getWineVarietiesAvailableToMake'
import FarmhandContext from '../Farmhand/Farmhand.context'

export const WineRecipeList = () => {
  const {
    gameState: { itemsSold },
  } = useContext(FarmhandContext)

  const winesVarietiesAvailableToMake = getWineVarietiesAvailableToMake(
    itemsSold
  )

  return <>{JSON.stringify(winesVarietiesAvailableToMake)}</>
}
