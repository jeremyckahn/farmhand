import React, { useEffect, useRef, useState } from 'react'

import { array, bool, func, number, object, string } from 'prop-types'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardHeader from '@material-ui/core/CardHeader'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons'

import FarmhandContext from '../Farmhand/Farmhand.context'

import { pixel } from '../../img'
import { genders } from '../../enums'
import {
  areHuggingMachinesInInventory,
  getCowDisplayName,
  getCowImage,
  getCowValue,
  isCowInBreedingPen,
  isInViewport,
} from '../../utils'
import { PURCHASEABLE_COW_PENS } from '../../constants'
import { OFFER_COW_FOR_TRADE, WITHDRAW_COW_FROM_TRADE } from '../../templates'

import Subheader from './Subheader'

import './CowCard.sass'

const genderIcons = {
  [genders.FEMALE]: faVenus,
  [genders.MALE]: faMars,
}

export const CowCard = ({
  allowCustomPeerCowNames,
  cow,
  cowBreedingPen,
  cowIdOfferedForTrade,
  cowInventory,
  debounced,
  handleCowAutomaticHugChange,
  handleCowBreedChange,
  handleCowHugClick,
  handleCowOfferClick,
  handleCowPurchaseClick,
  handleCowWithdrawClick,
  handleCowSellClick,
  handleCowTradeClick,
  id,
  inventory,
  isCowOfferedForTradeByPeer,
  isSelected,
  isOnline,
  money,
  purchasedCowPen,

  huggingMachinesRemain = areHuggingMachinesInInventory(inventory),
}) => {
  const cowDisplayName = getCowDisplayName(cow, id, allowCustomPeerCowNames)

  const [displayName, setDisplayName] = useState(cowDisplayName)
  const [cowImage, setCowImage] = useState(pixel)
  const cardRef = useRef()
  const scrollAnchorRef = useRef()

  const isCowPurchased =
    !!cowInventory.find(({ id }) => id === cow.id) &&
    !isCowOfferedForTradeByPeer
  const cowValue = getCowValue(cow, isCowPurchased)
  const cowCanBeTradedAway =
    isOnline && !isCowInBreedingPen(cow, cowBreedingPen)
  const canCowBeTradedFor = Boolean(
    isCowOfferedForTradeByPeer && cowIdOfferedForTrade.length > 0
  )

  useEffect(() => {
    ;(async () => {
      setCowImage(await getCowImage(cow))
    })()

    setDisplayName(getCowDisplayName(cow, id, allowCustomPeerCowNames))
  }, [cow, id, allowCustomPeerCowNames])

  useEffect(() => {
    if (isSelected) {
      const { current: scrollAnchor } = scrollAnchorRef
      const { current: card } = cardRef
      if (!scrollAnchor || !card) return

      // scrollIntoView is not defined in the unit test environment.
      if (scrollAnchor.scrollIntoView && !isInViewport(card)) {
        scrollAnchor.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [isSelected])

  return (
    <>
      <a
        {...{
          className: 'CowCard-scroll-anchor',
          href: `#cow-${cow.id}`,
          ref: scrollAnchorRef,
        }}
      >
        &nbsp;
      </a>
      <Card
        {...{
          className: classNames('CowCard', {
            'is-selected': isSelected,
            'is-purchased': isCowPurchased,
          }),
          raised: isSelected,
          ref: cardRef,
        }}
      >
        {isSelected && (
          <span className="visually_hidden">
            {displayName} is currently selected
          </span>
        )}
        <CardHeader
          {...{
            avatar: <img {...{ src: cowImage }} alt="Cow" />,
            title: (
              <>
                {isCowPurchased ? (
                  <TextField
                    {...{
                      disabled: id !== cow.originalOwnerId,
                      onChange: e => {
                        if (debounced) {
                          setDisplayName(e.target.value)
                          debounced.handleCowNameInputChange({ ...e }, cow)
                        }
                      },
                      placeholder: 'Name',
                      value: displayName,
                    }}
                  />
                ) : (
                  displayName
                )}{' '}
                <FontAwesomeIcon
                  {...{
                    icon: genderIcons[cow.gender],
                  }}
                />
              </>
            ),
            subheader: (
              <Subheader
                {...{
                  canCowBeTradedFor,
                  cow,
                  cowBreedingPen,
                  cowIdOfferedForTrade,
                  cowInventory,
                  cowValue,
                  handleCowBreedChange,
                  handleCowAutomaticHugChange,
                  huggingMachinesRemain,
                  id,
                  isCowPurchased,
                }}
              />
            ),
          }}
        />
        <CardActions>
          {!isCowPurchased && !isCowOfferedForTradeByPeer && (
            <Button
              {...{
                className: 'purchase',
                color: 'primary',
                disabled:
                  cowValue > money ||
                  cowInventory.length >=
                    PURCHASEABLE_COW_PENS.get(purchasedCowPen).cows,
                onClick: () => handleCowPurchaseClick(cow),
                variant: 'contained',
              }}
            >
              Buy
            </Button>
          )}
          {canCowBeTradedFor && (
            <Tooltip
              {...{
                arrow: true,
                placement: 'top',
                title: 'The game will be saved when the trade is completed.',
              }}
            >
              <Button
                {...{
                  className: 'purchase',
                  color: 'primary',
                  onClick: () => handleCowTradeClick(cow),
                  variant: 'contained',
                }}
              >
                Trade
              </Button>
            </Tooltip>
          )}
          {isCowPurchased && (
            <>
              <Button
                {...{
                  className: 'hug',
                  color: 'primary',
                  onClick: () => handleCowHugClick && handleCowHugClick(cow),
                  variant: 'contained',
                }}
              >
                Hug
              </Button>
              {cowCanBeTradedAway &&
                (cowIdOfferedForTrade === cow.id ? (
                  <Tooltip
                    {...{
                      arrow: true,
                      placement: 'top',
                      title: WITHDRAW_COW_FROM_TRADE`${cowDisplayName}`,
                    }}
                  >
                    <Button
                      {...{
                        className: 'offer',
                        color: 'primary',
                        onClick: () => {
                          handleCowWithdrawClick && handleCowWithdrawClick(cow)
                        },
                        variant: 'contained',
                      }}
                    >
                      Withdraw
                    </Button>
                  </Tooltip>
                ) : (
                  <Tooltip
                    {...{
                      arrow: true,
                      placement: 'top',
                      title: OFFER_COW_FOR_TRADE`${cowDisplayName}`,
                    }}
                  >
                    <Button
                      {...{
                        className: 'offer',
                        color: 'primary',
                        onClick: () => {
                          handleCowOfferClick && handleCowOfferClick(cow)
                        },
                        variant: 'contained',
                      }}
                    >
                      Offer
                    </Button>
                  </Tooltip>
                ))}
              <Button
                {...{
                  className: 'sell',
                  color: 'secondary',
                  onClick: () => handleCowSellClick(cow),
                  variant: 'contained',
                }}
              >
                Sell
              </Button>
            </>
          )}
        </CardActions>
      </Card>
    </>
  )
}

CowCard.propTypes = {
  allowCustomPeerCowNames: bool.isRequired,
  cow: object.isRequired,
  cowBreedingPen: object.isRequired,
  cowIdOfferedForTrade: string.isRequired,
  cowInventory: array.isRequired,
  debounced: object,
  handleCowAutomaticHugChange: func,
  handleCowBreedChange: func,
  handleCowHugClick: func,
  handleCowNameInputChange: func,
  handleCowOfferClick: func,
  handleCowPurchaseClick: func,
  handleCowWithdrawClick: func,
  handleCowSellClick: func,
  handleCowTradeClick: func,
  id: string.isRequired,
  inventory: array.isRequired,
  isCowOfferedForTradeByPeer: bool,
  isOnline: bool.isRequired,
  isSelected: bool,
  money: number.isRequired,
  purchasedCowPen: number.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <CowCard {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
