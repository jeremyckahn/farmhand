import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import { func, instanceOf, node, number, string } from 'prop-types'

import FarmhandContext from '../Farmhand/Farmhand.context'
import './TierPurchase.sass'

export function TierPurchase({
  description,
  onBuyClick,
  maxedOutPlaceholder,
  money,
  purchasedTier,
  renderTierLabel,
  tiers,
  title,
}) {
  const [selectedTier, setSelectedTier] = useState(purchasedTier)

  const tierValues = [...tiers.entries()]

  const selectedTierNumber = Number(selectedTier)

  const hasPurchasedTier = tierLevel => tierLevel <= purchasedTier
  const hasPurchasedHighestTier = hasPurchasedTier(tierValues.slice(-1)[0][0])

  if (hasPurchasedTier(selectedTier)) {
    const nextTierNumber = selectedTierNumber + 1
    const nextTierToPurchase = tiers.get(nextTierNumber)

    if (nextTierToPurchase && money >= nextTierToPurchase.price) {
      setSelectedTier(`${nextTierNumber}`)
    }
  }

  const canPlayerBuySelectedTier = () => {
    const selectedTier = tiers.get(selectedTierNumber)

    return (
      !!selectedTier &&
      !hasPurchasedTier(selectedTierNumber) &&
      money >= selectedTier.price
    )
  }

  const handleBuyClick = () => {
    const canAfford = tiers.get(selectedTierNumber).price <= money

    if (canAfford) {
      onBuyClick(selectedTierNumber)
    }
  }

  const handleTierSelected = ({ target: { value } }) => {
    setSelectedTier(value)
  }

  return (
    <Card className="TierPurchase">
      <CardHeader {...{ title }} />
      {description && (
        <CardContent>
          <Typography>{description}</Typography>
        </CardContent>
      )}
      {hasPurchasedHighestTier && maxedOutPlaceholder ? (
        <CardContent>
          <Typography>
            <strong>{maxedOutPlaceholder}</strong>
          </Typography>
        </CardContent>
      ) : (
        <>
          <CardActions>
            <Button
              {...{
                color: 'primary',
                disabled: !canPlayerBuySelectedTier,
                onClick: handleBuyClick,
                variant: 'contained',
              }}
            >
              Buy
            </Button>
            <Select
              {...{
                onChange: handleTierSelected,
                value: selectedTier > 0 ? selectedTier : '',
              }}
            >
              {tierValues.map(([playerId, tier]) => (
                <MenuItem
                  key={playerId}
                  value={playerId}
                  disabled={money < tier.price || hasPurchasedTier(playerId)}
                >
                  {renderTierLabel(tier)}
                </MenuItem>
              ))}
            </Select>
          </CardActions>
        </>
      )}
    </Card>
  )
}

TierPurchase.propTypes = {
  description: string,
  onBuyClick: func.isRequired,
  maxedOutPlaceholder: node,
  money: number.isRequired,
  purchasedTier: number.isRequired,
  renderTierLabel: func.isRequired,
  tiers: instanceOf(Map),
  title: string.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <TierPurchase {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
