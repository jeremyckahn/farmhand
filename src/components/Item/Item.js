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
import { array, bool, func, number, object } from 'prop-types'
import classNames from 'classnames'

import FarmhandContext from '../../Farmhand.context'
import { items } from '../../img'
import { itemsMap } from '../../data/maps'
import {
  inventorySpaceRemaining,
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
      onValueChange: ({ floatValue = 0 }) =>
        onChange(Math.min(floatValue, max)),
    }}
  />
)

const QuantityInput = ({ handleSubmit, handleUpdateNumber, max, value }) => (
  <TextField
    {...{
      value,
      inputProps: {
        pattern: '[0-9]*',
        min: 0,
        max,
      },
      onChange: handleUpdateNumber,
      // Bind to keyup to prevent spamming the event handler.
      onKeyUp: ({ which }) => {
        // Enter
        if (which === 13) {
          handleSubmit()
        }
      },

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
  inventory,
  inventoryLimit,
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

  maxQuantityPlayerCanPurchase = Math.max(
    0,
    Math.min(
      Math.floor(money / adjustedValue),
      inventorySpaceRemaining({ inventory, inventoryLimit })
    )
  ),
}) => {
  const [purchaseQuantity, setPurchaseQuantity] = useState(1)
  const [sellQuantity, setSellQuantity] = useState(1)

  useEffect(() => {
    setPurchaseQuantity(
      Math.min(maxQuantityPlayerCanPurchase, purchaseQuantity)
    )
  }, [maxQuantityPlayerCanPurchase, purchaseQuantity])

  useEffect(() => {
    setSellQuantity(Math.min(playerInventoryQuantities[id], sellQuantity))
  }, [id, playerInventoryQuantities, sellQuantity])

  const handleItemPurchase = () => {
    handleItemPurchaseClick(item, purchaseQuantity)
    setPurchaseQuantity(Math.min(1, maxQuantityPlayerCanPurchase))
  }
  const handleItemSell = () => {
    handleItemSellClick(item, sellQuantity)
    setSellQuantity(Math.min(1, playerInventoryQuantities[id]))
  }

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
                onClick: handleItemPurchase,
                variant: 'contained',
              }}
            >
              Buy
            </Button>
            <div className="quantity">
              <QuantityInput
                {...{
                  handleSubmit: handleItemPurchase,
                  handleUpdateNumber: setPurchaseQuantity,
                  max: maxQuantityPlayerCanPurchase,
                  value: purchaseQuantity,
                }}
              />
              <Button
                {...{
                  onClick: () =>
                    setPurchaseQuantity(maxQuantityPlayerCanPurchase),
                }}
              >
                / {integerString(maxQuantityPlayerCanPurchase)}
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
                onClick: handleItemSell,
                variant: 'contained',
              }}
            >
              Sell
            </Button>
            <div className="quantity">
              <QuantityInput
                {...{
                  handleSubmit: handleItemSell,
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
  inventory: array.isRequired,
  inventoryLimit: number.isRequired,
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
