import React, { useEffect, useState } from 'react'
import KeyboardArrowUp from '@mui/icons-material/KeyboardArrowUp.js'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown.js'
import Button from '@mui/material/Button/index.js'
import Box from '@mui/material/Box/index.js'
import Card from '@mui/material/Card/index.js'
import CardHeader from '@mui/material/CardHeader/index.js'
import CardContent from '@mui/material/CardContent/index.js'
import CardActions from '@mui/material/CardActions/index.js'
import Tooltip from '@mui/material/Tooltip/index.js'
import Typography from '@mui/material/Typography/index.js'
import { array, bool, func, number, object } from 'prop-types'
import classNames from 'classnames'

import FarmhandContext from '../Farmhand/Farmhand.context.js'
import { items } from '../../img/index.js'
import { itemsMap } from '../../data/maps.js'
import { itemIds as shopItemIds } from '../../data/shop-inventory.js'
import { noop } from '../../utils/noop.js'
import { moneyString } from '../../utils/moneyString.js'
import {
  inventorySpaceRemaining,
  isItemSoldInShop,
  getFinalCropItemFromSeedItem,
  getItemCurrentValue,
  getResaleValue,
  getSalePriceMultiplier,
  integerString,
} from '../../utils/index.js'
import { getCropLifecycleDuration } from '../../utils/getCropLifecycleDuration.js'
import QuantityInput from '../QuantityInput/index.js'
import AnimatedNumber from '../AnimatedNumber/index.js'

import './Item.sass'

const ValueIndicator = ({ poorValue }) => (
  <Tooltip
    {...{
      arrow: true,
      placement: 'top',
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
  /** @type {farmhand.item['id']} */ id,
  /** @type {farmhand.item['value']} */ value,
  /** @type {farmhand.state['valueAdjustments']} */ valueAdjustments,

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

export const Item = ({
  completedAchievements,
  handleItemPurchaseClick,
  handleItemSelectClick,
  handleItemSellClick,
  historicalValueAdjustments,
  inventory,
  inventoryLimit,
  isPurchaseView,
  isSelectView,
  isSelected,
  isSellView,
  /** @type {farmhand.item} */ item,
  item: {
    description,
    doesPriceFluctuate,
    id,
    isReplantable,
    name,
    type,
    value,
  },
  money,
  playerInventoryQuantities,
  showQuantity,
  valueAdjustments,

  // Note: These props are defaulted to 0 in the tests.
  adjustedValue = isSellView && isItemSoldInShop(item)
    ? getResaleValue(item)
    : getItemCurrentValue(item, valueAdjustments),

  previousDayAdjustedValue = (isSellView && isItemSoldInShop(item)) ||
  historicalValueAdjustments.length === 0 ||
  !doesPriceFluctuate
    ? null
    : getItemCurrentValue(item, historicalValueAdjustments[0]),

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
    // TODO: Determine if this logic can be simplified to be more like the
    // useEffect function below.
    setPurchaseQuantity(
      Math.min(maxQuantityPlayerCanPurchase, Math.max(1, purchaseQuantity))
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

  const avatar = <img {...{ src: items[id] }} alt={name} />

  let sellPrice = adjustedValue

  // #140 - never increase the value of items the shop sells otherwise they
  // can be bought and instantly resold for a profit to game the.. game
  if (!shopItemIds.has(id)) {
    sellPrice *= getSalePriceMultiplier(completedAchievements)
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
          avatar:
            !isPurchaseView && description ? (
              <Tooltip
                {...{
                  arrow: true,
                  placement: 'top',
                  title: <Typography>{description}</Typography>,
                }}
              >
                {avatar}
              </Tooltip>
            ) : (
              avatar
            ),
          title: name,
          subheader: (
            <div>
              {isPurchaseView && (
                <p>
                  <Tooltip
                    {...{
                      arrow: true,
                      placement: 'top',
                      title:
                        previousDayAdjustedValue === null
                          ? ''
                          : `Yesterday's price: ${moneyString(
                              previousDayAdjustedValue
                            )}`,
                    }}
                  >
                    <span>
                      Price:{' '}
                      <AnimatedNumber
                        {...{ number: adjustedValue, formatter: moneyString }}
                      />
                    </span>
                  </Tooltip>
                  {completedAchievements['unlock-crop-price-guide'] &&
                    valueAdjustments[id] && (
                      <PurchaseValueIndicator
                        {...{ id, value: adjustedValue, valueAdjustments }}
                      />
                    )}
                </p>
              )}
              {isPurchaseView && (
                <p>
                  Total:{' '}
                  {purchaseQuantity ? (
                    <AnimatedNumber
                      {...{
                        number: purchaseQuantity * adjustedValue,
                        formatter: moneyString,
                      }}
                    />
                  ) : null}
                </p>
              )}
              {isSellView && (
                <p>
                  <Tooltip
                    {...{
                      arrow: true,
                      placement: 'top',
                      title:
                        previousDayAdjustedValue === null
                          ? ''
                          : `Yesterday's sell price: ${moneyString(
                              previousDayAdjustedValue
                            )}`,
                    }}
                  >
                    <span>
                      Sell price:{' '}
                      <AnimatedNumber
                        {...{ number: sellPrice, formatter: moneyString }}
                      />
                    </span>
                  </Tooltip>
                  {completedAchievements['unlock-crop-price-guide'] &&
                    valueAdjustments[id] && (
                      <SellValueIndicator
                        {...{ id, value: adjustedValue, valueAdjustments }}
                      />
                    )}
                </p>
              )}
              {isSellView && (
                <p>
                  Total:{' '}
                  {sellQuantity ? (
                    <AnimatedNumber
                      {...{
                        number: sellQuantity * sellPrice,
                        formatter: moneyString,
                      }}
                    />
                  ) : null}
                </p>
              )}
              {showQuantity && (
                <p>
                  <strong>In inventory:</strong>{' '}
                  <AnimatedNumber
                    {...{
                      number: playerInventoryQuantities[id],
                      formatter: integerString,
                    }}
                  />
                </p>
              )}
              {isPurchaseView &&
                /** @type {globalThis.farmhand.item} */ (item).growsInto && (
                  <p>
                    Days to mature:{' '}
                    {getCropLifecycleDuration(
                      getFinalCropItemFromSeedItem(item)
                    )}
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
                  !purchaseQuantity || adjustedValue * purchaseQuantity > money,
                onClick: handleItemPurchase,
                variant: 'contained',
              }}
            >
              Buy
            </Button>
            <QuantityInput
              {...{
                handleSubmit: handleItemPurchase,
                handleUpdateNumber: setPurchaseQuantity,
                maxQuantity: maxQuantityPlayerCanPurchase,
                setQuantity: setPurchaseQuantity,
                value: purchaseQuantity,
              }}
            />
          </>
        )}
        {isSellView && (
          <Box display="flex">
            <Button
              {...{
                className: 'sell',
                color: 'error',
                disabled: sellQuantity === 0 || !sellQuantity,
                onClick: handleItemSell,
                variant: 'contained',
              }}
            >
              Sell
            </Button>
            <QuantityInput
              {...{
                handleSubmit: handleItemSell,
                handleUpdateNumber: setSellQuantity,
                maxQuantity: playerInventoryQuantities[id],
                setQuantity: setSellQuantity,
                value: sellQuantity,
              }}
            />
          </Box>
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
  historicalValueAdjustments: array.isRequired,
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
