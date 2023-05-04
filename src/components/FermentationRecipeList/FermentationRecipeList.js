import React, { useContext } from 'react'

import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'

import { itemsMap, fermentableItemsMap } from '../../data/maps'
import FarmhandContext from '../Farmhand/Farmhand.context'
import { getFinalCropItemFromSeedItem } from '../../utils'
import { items } from '../../img'

import './FermentationRecipe.sass'

const totalFermentableItems = Object.keys(fermentableItemsMap).length

export function FermentationRecipeList() {
  const {
    gameState: { levelEntitlements },
  } = useContext(FarmhandContext)

  const cropsAvailableToFerment = Object.keys(levelEntitlements.items)
    .map(itemId => getFinalCropItemFromSeedItem(itemsMap[itemId]))
    .filter(item => (item ? 'daysToFerment' in item : false))

  const numberOfCropsAvailableToFerment = Object.keys(cropsAvailableToFerment)
    .length

  // FIXME: Test recipe count display
  return (
    <>
      <h3>
        Learned Fermentation Recipes ({numberOfCropsAvailableToFerment} /{' '}
        {totalFermentableItems})
      </h3>
      <ul className="card-list">
        {cropsAvailableToFerment.map(item => (
          <Card key={item.id} className="FermentationRecipe">
            <CardHeader
              title={item.name}
              avatar={<img {...{ src: items[item.id] }} alt={item.name} />}
            ></CardHeader>
            <CardContent></CardContent>
            <CardActions></CardActions>
          </Card>
        ))}
      </ul>
    </>
  )
}

FermentationRecipeList.propTypes = {}
