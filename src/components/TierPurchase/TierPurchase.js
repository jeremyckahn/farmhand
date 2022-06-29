import React, { Component } from 'react'
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

export class TierPurchase extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTier: '',
    }

    this.tierValues = [...props.tiers.entries()]
  }

  get selectedTierNumber() {
    return Number(this.state.selectedTier)
  }

  get canPlayerBuySelectedTier() {
    const {
      props: { money },
      selectedTierNumber,
    } = this

    const selectedTier = this.props.tiers.get(selectedTierNumber)

    return (
      !!selectedTier &&
      !this.hasPurchasedTier(selectedTierNumber) &&
      money >= selectedTier.price
    )
  }

  hasPurchasedTier = tierLevel => tierLevel <= this.props.purchasedTier

  handleTierPurchase = () => {
    const {
      props: { handleTierPurchase, money },
      selectedTierNumber,
    } = this
    const { price } = this.props.tiers.get(selectedTierNumber)

    if (money >= price) {
      handleTierPurchase(selectedTierNumber)
    }
  }

  onSelectChange = ({ target: { value } }) => {
    this.setState({ selectedTier: value })
  }

  updateSelectedTier = () => {
    const {
      props: { money },
      selectedTierNumber,
    } = this

    const nextTierNumber = selectedTierNumber + 1
    const nextTierToPurchase = this.props.tiers.get(nextTierNumber)

    if (nextTierToPurchase && money >= nextTierToPurchase.price) {
      this.setState({ selectedTier: String(nextTierNumber) })
    }
  }

  componentDidMount() {
    this.updateSelectedTier()
  }

  componentDidUpdate(prevProps) {
    if (this.props.money !== prevProps.money) {
      this.updateSelectedTier()
    }
  }

  render() {
    const {
      canPlayerBuySelectedTier,
      handleTierPurchase,
      hasPurchasedTier,
      onSelectChange,
      props: {
        description,
        maxedOutPlaceholder,
        money,
        renderTierLabel,
        title,
      },
      tierValues,
      state: { selectedTier },
    } = this

    const hasPurchasedHighestTier = hasPurchasedTier(tierValues.slice(-1)[0][0])

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
                  onClick: handleTierPurchase,
                  variant: 'contained',
                }}
              >
                Buy
              </Button>
              <Select
                {...{
                  onChange: onSelectChange,
                  value: selectedTier,
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
          </>
        )}
      </Card>
    )
  }
}

TierPurchase.propTypes = {
  description: string,
  handleTierPurchase: func.isRequired,
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
