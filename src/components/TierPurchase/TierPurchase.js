import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { func, instanceOf, number, string } from 'prop-types'

import FarmhandContext from '../../Farmhand.context'
import './TierPurchase.sass'

export class TierPurchase extends Component {
  state = {
    selectedTier: '',
  }

  tierValues = [...this.props.tiers.entries()]

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
      props: { money, renderTierLabel, title },
      tierValues,
      state: { selectedTier },
    } = this

    return (
      <div className="TierPurchase">
        <h2>{title}</h2>
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
      </div>
    )
  }
}

TierPurchase.propTypes = {
  handleTierPurchase: func.isRequired,
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
