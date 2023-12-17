import React, { useState } from 'react'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import { func, instanceOf, node, number, string } from 'prop-types'

import FarmhandContext from '../Farmhand/Farmhand.context'

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
            variant="standard"
            sx={{
              flexGrow: 1,
              m: 0,
              ml: '1rem',
              maxWidth: 300,
            }}
            {...{
              onChange: handleTierSelected,
              value: selectedTier > 0 ? selectedTier : '',
            }}
          >
            {tierValues.map(([id, tier]) => (
              <MenuItem
                key={id}
                value={id}
                disabled={money < tier.price || hasPurchasedTier(id)}
              >
                {renderTierLabel(tier)}
              </MenuItem>
            ))}
          </Select>
        </CardActions>
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
