import React from 'react'
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import Tooltip from '@material-ui/core/Tooltip'
import { bool, func, number, object } from 'prop-types'
import classNames from 'classnames'

import FarmhandContext from '../../Farmhand.context'
import { items } from '../../img'
import { itemsMap } from '../../data/maps'
import {
  getCropLifecycleDuration,
  getFinalCropItemFromSeedItem,
  getItemValue,
  moneyString,
} from '../../utils'

import './Item.sass'

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

export const Item = ({
  bulkPurchaseSize,
  completedAchievements,
  handleItemMaxOutClick,
  handleItemPurchaseClick,
  handleItemSelectClick,
  handleItemSellAllClick,
  handleItemSellClick,
  isPurchaseView,
  isSelectView,
  isSelected,
  isSellView,
  item,
  item: { id, name },
  money,
  playerInventoryQuantities,
  showQuantity,
  valueAdjustments,

  adjustedValue = getItemValue(item, valueAdjustments),
  disableSellButtons = playerInventoryQuantities[id] === 0,
}) => (
  <Card
    {...{
      className: classNames('Item', { 'is-selected': isSelected }),
      onClick: isSelectView && (() => handleItemSelectClick(item)),
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
              <>
                <p>
                  {`Price: ${moneyString(adjustedValue)}`}
                  {completedAchievements['unlock-crop-price-guide'] &&
                    valueAdjustments[id] && (
                      <PurchaseValueIndicator
                        {...{ id, value: adjustedValue, valueAdjustments }}
                      />
                    )}
                </p>
              </>
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
                <strong>In Inventory:</strong> {playerInventoryQuantities[id]}
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
              disabled: adjustedValue > money,
              onClick: () => handleItemPurchaseClick(item),
              variant: 'contained',
            }}
          >
            Buy
          </Button>
          {bulkPurchaseSize && (
            <Button
              {...{
                className: 'bulk purchase',
                color: 'primary',
                disabled: adjustedValue * bulkPurchaseSize > money,
                onClick: () => handleItemPurchaseClick(item, bulkPurchaseSize),
                variant: 'contained',
              }}
            >
              Buy {bulkPurchaseSize}
            </Button>
          )}
          <Button
            {...{
              className: 'max-out',
              color: 'primary',
              disabled: adjustedValue > money,
              onClick: () => handleItemMaxOutClick(item),
              variant: 'contained',
            }}
          >
            Max Out
          </Button>
        </>
      )}
      {isSellView && (
        <>
          <Button
            {...{
              className: 'sell',
              color: 'secondary',
              disabled: disableSellButtons,
              onClick: () => handleItemSellClick(item),
              variant: 'contained',
            }}
          >
            Sell
          </Button>
          <Button
            {...{
              className: 'sell-all',
              color: 'secondary',
              disabled: disableSellButtons,
              onClick: () => handleItemSellAllClick(item),
              variant: 'contained',
            }}
          >
            Sell All
          </Button>
        </>
      )}
    </CardActions>
  </Card>
)

Item.propTypes = {
  adjustedValue: number,
  bulkPurchaseSize: number,
  completedAchievements: object.isRequired,
  disableSellButtons: bool,
  handleItemMaxOutClick: func,
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
