import React, { useEffect, useRef, useState } from 'react'

import { array, bool, func, number, object, string } from 'prop-types'
import Button from '@mui/material/Button/index.js'
import Card from '@mui/material/Card/index.js'
import CardActions from '@mui/material/CardActions/index.js'
import CardHeader from '@mui/material/CardHeader/index.js'
import TextField from '@mui/material/TextField/index.js'
import Tooltip from '@mui/material/Tooltip/index.js'
import Typography from '@mui/material/Typography/index.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons'
import { useIsMounted } from 'usehooks-ts'

import FarmhandContext, { BoundHandlers } from '../Farmhand/Farmhand.context.js'
import uiEventHandlers from '../../handlers/ui-events.js'

import { pixel } from '../../img/index.js'
import { genders } from '../../enums.js'
import {
  areHuggingMachinesInInventory,
  getCowDisplayName,
  getCowImage,
  getCowValue,
  isCowInBreedingPen,
  isInViewport,
} from '../../utils/index.js'
import { PURCHASEABLE_COW_PENS } from '../../constants.js'
import {
  OFFER_COW_FOR_TRADE,
  WITHDRAW_COW_FROM_TRADE,
} from '../../templates.js'

import Subheader from './Subheader/index.js'

import './CowCard.sass'

const genderIcons = {
  [genders.FEMALE]: faVenus,
  [genders.MALE]: faMars,
}

export interface CowCardProps {
  allowCustomPeerCowNames: farmhand.state['allowCustomPeerCowNames']
  cow: farmhand.cow
  cowBreedingPen: farmhand.cowBreedingPen
  cowIdOfferedForTrade: farmhand.state['cowIdOfferedForTrade']
  cowInventory: farmhand.state['cowInventory']
  debounced?: Partial<BoundHandlers<typeof uiEventHandlers>>
  handleCowAutomaticHugChange?: BoundHandlers<
    typeof uiEventHandlers
  >['handleCowAutomaticHugChange']
  handleCowBreedChange?: BoundHandlers<
    typeof uiEventHandlers
  >['handleCowBreedChange']
  handleCowHugClick?: BoundHandlers<typeof uiEventHandlers>['handleCowHugClick']
  handleCowNameInputChange?: BoundHandlers<
    typeof uiEventHandlers
  >['handleCowNameInputChange']
  handleCowOfferClick?: BoundHandlers<
    typeof uiEventHandlers
  >['handleCowOfferClick']
  handleCowPurchaseClick?: BoundHandlers<
    typeof uiEventHandlers
  >['handleCowPurchaseClick']
  handleCowWithdrawClick?: BoundHandlers<
    typeof uiEventHandlers
  >['handleCowWithdrawClick']
  handleCowSellClick?: BoundHandlers<
    typeof uiEventHandlers
  >['handleCowSellClick']
  handleCowTradeClick?: BoundHandlers<
    typeof uiEventHandlers
  >['handleCowTradeClick']
  playerId: farmhand.state['playerId']
  inventory: farmhand.state['inventory']
  isCowOfferedForTradeByPeer?: boolean
  isSelected?: boolean
  isOnline: farmhand.state['isOnline']
  money: farmhand.state['money']
  purchasedCowPen: farmhand.state['purchasedCowPen']
  huggingMachinesRemain?: boolean
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
  playerId,
  inventory,
  isCowOfferedForTradeByPeer,
  isSelected,
  isOnline,
  money,
  purchasedCowPen,

  huggingMachinesRemain = areHuggingMachinesInInventory(inventory),
}: CowCardProps) => {
  const cowDisplayName = getCowDisplayName(
    cow,
    playerId,
    allowCustomPeerCowNames
  )

  const [displayName, setDisplayName] = useState(cowDisplayName)
  const [cowImage, setCowImage] = useState(pixel)

  // @see https://github.com/microsoft/TypeScript/issues/27387#issuecomment-659671940
  const cardRef = useRef<HTMLDivElement>(null)
  const scrollAnchorRef = useRef<HTMLAnchorElement>(null)

  const isCowPurchased =
    !!cowInventory.find(({ id }) => id === cow.id) &&
    !isCowOfferedForTradeByPeer

  // cow.originalOwnerId is only an empty string when it is for sale.
  const cowValue = getCowValue(cow, cow.originalOwnerId !== '')
  const cowCanBeTradedAway =
    isOnline && !isCowInBreedingPen(cow, cowBreedingPen)
  const canCowBeTradedFor = Boolean(
    isCowOfferedForTradeByPeer && cowIdOfferedForTrade.length > 0
  )

  const isMounted = useIsMounted()

  useEffect(() => {
    ;(async () => {
      const fetchedCowImage = await getCowImage(cow)

      if (isMounted() === false) return

      setCowImage(fetchedCowImage)
    })()

    setDisplayName(getCowDisplayName(cow, playerId, allowCustomPeerCowNames))
  }, [cow, playerId, allowCustomPeerCowNames, isMounted])

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
                    variant="standard"
                    {...{
                      disabled: playerId !== cow.originalOwnerId,
                      onChange: e => {
                        setDisplayName(e.target.value)
                        debounced?.handleCowNameInputChange?.(
                          e.target.value,
                          cow
                        )
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
                  playerId,
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
                    (PURCHASEABLE_COW_PENS.get(purchasedCowPen)?.cows ?? 0),
                onClick: () => handleCowPurchaseClick?.(cow),
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
                  onClick: () => handleCowTradeClick?.(cow),
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
                  onClick: () => handleCowHugClick?.(cow),
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
                      title: WITHDRAW_COW_FROM_TRADE('', cowDisplayName),
                    }}
                  >
                    <Button
                      {...{
                        className: 'offer',
                        color: 'primary',
                        onClick: () => {
                          handleCowWithdrawClick?.(cow)
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
                      title: (
                        <Typography>
                          {OFFER_COW_FOR_TRADE('', cowDisplayName)}
                        </Typography>
                      ),
                    }}
                  >
                    <Button
                      {...{
                        className: 'offer',
                        color: 'primary',
                        onClick: () => {
                          handleCowOfferClick?.(cow)
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
                  color: 'error',
                  onClick: () => handleCowSellClick?.(cow),
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
  playerId: string.isRequired,
  inventory: array.isRequired,
  isCowOfferedForTradeByPeer: bool,
  isOnline: bool.isRequired,
  isSelected: bool,
  money: number.isRequired,
  purchasedCowPen: number.isRequired,
}

export default function Consumer(
  props: Pick<CowCardProps, 'cow' | 'isCowOfferedForTradeByPeer' | 'isSelected'>
) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <CowCard {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
