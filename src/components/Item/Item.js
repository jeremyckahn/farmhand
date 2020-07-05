import React, { useEffect, useState } from 'react'
import NumberFormat from 'react-number-format'
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import { bool, func, number, object } from 'prop-types'
import classNames from 'classnames'

import FarmhandContext from '../../Farmhand.context'
import { items } from '../../img'
import { itemsMap } from '../../data/maps'
import {
  isItemSoldInShop,
  getCropLifecycleDuration,
  getFinalCropItemFromSeedItem,
  getItemValue,
  getResaleValue,
  moneyString,
  integerString,
} from '../../utils'

import './Item.sass'

const noop = () => {}

const ValueIndicator = ({
  id,
  value,
  valueAdjustments,

  poorValue,
}) => (
  <Tooltip
    {...{
      placement: 'right',
      title: `${poorValue ? 'Poor' : 'Good'} opportunity`,
    }}
  >
    {poorValue ? (
      <KeyboardArrowDown color="error" />
    ) : (
      <KeyboardArrowUp color="primary" />
    )}
  </Tooltip>
)

const PurchaseValueIndicator = ({
  id,
  value,
  valueAdjustments,

  poorValue = value > itemsMap[id].value,
}) => (
  <ValueIndicator
    {...{
      id,
      poorValue,
      value,
      valueAdjustments,
    }}
  />
)

const SellValueIndicator = ({
  id,
  value,
  valueAdjustments,

  poorValue = value < itemsMap[id].value,
}) => (
  <ValueIndicator
    {...{
      id,
      poorValue,
      value,
      valueAdjustments,
    }}
  />
)

const QuantityNumberFormat = ({ inputRef, min, max, onChange, ...rest }) => (
  <NumberFormat
    isNumericString
    thousandSeparator
    {...{
      ...rest,
      allowNegative: false,
      decimalScale: 0,
      isAllowed: ({ floatValue = 0 }) => floatValue >= min && floatValue <= max,
      onValueChange: ({ floatValue = 0 }) => onChange(floatValue),
    }}
  />
)

const QuantityInput = ({ handleUpdateNumber, max, value }) => (
  <TextField
    {...{
      value,
      inputProps: {
        pattern: '[0-9]*',
        min: 0,
        max,
      },
      onChange: handleUpdateNumber,
      InputProps: {
        inputComponent: QuantityNumberFormat,
      },
    }}
  />
)

export const Item = ({
  completedAchievements,
  handleItemPurchaseClick,
  handleItemSelectClick,
  handleItemSellClick,
  isPurchaseView,
  isSelectView,
  isSelected,
  isSellView,
  item,
  item: { id, isReplantable, description, name },
  money,
  playerInventoryQuantities,
  showQuantity,
  valueAdjustments,

  // Note: This prop is defaulted to 0 in the tests.
  adjustedValue = isSellView && isItemSoldInShop(item)
    ? getResaleValue(item)
    : getItemValue(item, valueAdjustments),

  maxQuantityPlayerCanAfford = Math.floor(money / adjustedValue),
}) => {
  const [purchaseQuantity, setPurchaseQuantity] = useState(1)
  const [sellQuantity, setSellQuantity] = useState(1)

  useEffect(() => {
    setPurchaseQuantity(Math.min(maxQuantityPlayerCanAfford, purchaseQuantity))
  }, [maxQuantityPlayerCanAfford, purchaseQuantity])

  useEffect(() => {
    setSellQuantity(Math.min(playerInventoryQuantities[id], sellQuantity))
  }, [id, playerInventoryQuantities, sellQuantity])

  return (
    <Card
      {...{
        className: classNames('Item', {
          'is-selectable': isSelectView,
          'is-selected': isSelected,
        }),
        onClick: isSelectView ? () => handleItemSelectClick(item) : noop,
        raised: isSelected,
      }}
    >
      <CardHeader
        {...{
          avatar: <img {...{ src: items[id] }} alt={name} />,
          title: name,
          subheader: (
            <div>
              {isPurchaseView && (
                <p>
                  {`Price: ${moneyString(adjustedValue)}`}
                  {completedAchievements['unlock-crop-price-guide'] &&
                    valueAdjustments[id] && (
                      <PurchaseValueIndicator
                        {...{ id, value: adjustedValue, valueAdjustments }}
                      />
                    )}
                </p>
              )}
              {isSellView && (
                <p>
                  {`Sell price: ${moneyString(adjustedValue)}`}
                  {completedAchievements['unlock-crop-price-guide'] &&
                    valueAdjustments[id] && (
                      <SellValueIndicator
                        {...{ id, value: adjustedValue, valueAdjustments }}
                      />
                    )}
                </p>
              )}
              {showQuantity && (
                <p>
                  <strong>In Inventory:</strong>{' '}
                  {integerString(playerInventoryQuantities[id])}
                </p>
              )}
              {isPurchaseView && item.growsInto && (
                <p>
                  Days to mature:{' '}
                  {getCropLifecycleDuration(getFinalCropItemFromSeedItem(item))}
                </p>
              )}
            </div>
          ),
        }}
      />
      {isPurchaseView && (description || isReplantable) && (
        <CardContent>
          {description && <Typography>{description}</Typography>}
          {isReplantable && (
            <Typography {...{ color: 'textSecondary' }}>
              Once planted in the field, this item can be returned to your
              inventory with the hoe and then replanted elsewhere.
            </Typography>
          )}
        </CardContent>
      )}
      <CardActions>
        {isSelectView && (
          <Button
            {...{
              // The onClick handler for this is bound on the parent Card for
              // better select-ability.
              className: 'select',
              color: 'primary',
              variant: isSelected ? 'contained' : 'outlined',
            }}
          >
            Select
          </Button>
        )}
        {isPurchaseView && (
          <>
            <Button
              {...{
                className: 'purchase',
                color: 'primary',
                disabled:
                  purchaseQuantity === 0 ||
                  adjustedValue * purchaseQuantity > money,
                onClick: () => handleItemPurchaseClick(item, purchaseQuantity),
                variant: 'contained',
              }}
            >
              Buy
            </Button>
            <div className="quantity">
              <QuantityInput
                {...{
                  handleUpdateNumber: setPurchaseQuantity,
                  max: maxQuantityPlayerCanAfford,
                  value: purchaseQuantity,
                }}
              />
              <Button
                {...{
                  onClick: () =>
                    setPurchaseQuantity(maxQuantityPlayerCanAfford),
                }}
              >
                / {integerString(maxQuantityPlayerCanAfford)}
              </Button>
            </div>
          </>
        )}
        {isSellView && (
          <>
            <Button
              {...{
                className: 'sell',
                color: 'secondary',
                disabled: sellQuantity === 0,
                onClick: () => handleItemSellClick(item, sellQuantity),
                variant: 'contained',
              }}
            >
              Sell
            </Button>
            <div className="quantity">
              <QuantityInput
                {...{
                  handleUpdateNumber: setSellQuantity,
                  max: playerInventoryQuantities[id],
                  value: sellQuantity,
                }}
              />
              <Button
                {...{
                  onClick: () => setSellQuantity(playerInventoryQuantities[id]),
                }}
              >
                / {integerString(playerInventoryQuantities[id])}
              </Button>
            </div>
          </>
        )}
      </CardActions>
    </Card>
  )
}

Item.propTypes = {
  adjustedValue: number,
  completedAchievements: object.isRequired,
  handleItemPurchaseClick: func,
  handleItemSelectClick: func,
  handleItemSellClick: func,
  isPurchaseView: bool,
  isSelectView: bool,
  isSelected: bool,
  isSellView: bool,
  item: object.isRequired,
  money: number.isRequired,
  playerInventoryQuantities: object.isRequired,
  showQuantity: bool,
  valueAdjustments: object.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Item {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
