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

import FarmhandContext from '../Farmhand/Farmhand.context.js'

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

/**
 * @typedef {{
 *   allowCustomPeerCowNames: boolean,
 *   cow: globalThis.farmhand.cow,
 *   cowBreedingPen: globalThis.farmhand.cowBreedingPen,
 *   cowInventory: globalThis.farmhand.state['cowInventory'],
 *   cowIdOfferedForTrade: globalThis.farmhand.cow['id'],
 *   debounced: import('../../handlers/ui-events.js').default['debounced'],
 *   handleCowAutomaticHugChange: import('../../handlers/ui-events.js').default['handleCowAutomaticHugChange'],
 *   handleCowBreedChange: import('../../handlers/ui-events.js').default['handleCowBreedChange'],
 *   handleCowHugClick: import('../../handlers/ui-events.js').default['handleCowHugClick'],
 *   handleCowOfferClick: import('../../handlers/ui-events.js').default['handleCowOfferClick'],
 *   handleCowPurchaseClick: import('../../handlers/ui-events.js').default['handleCowPurchaseClick'],
 *   handleCowWithdrawClick: import('../../handlers/ui-events.js').default['handleCowWithdrawClick'],
 *   handleCowSellClick: import('../../handlers/ui-events.js').default['handleCowSellClick'],
 *   handleCowTradeClick: import('../../handlers/ui-events.js').default['handleCowTradeClick'],
 *   id: globalThis.farmhand.state['id'],
 *   inventory: globalThis.farmhand.state['inventory'],
 *   isCowOfferedForTradeByPeer: boolean,
 *   isSelected: boolean,
 *   isOnline: boolean,
 *   money: globalThis.farmhand.state['money'],
 *   purchasedCowPen: globalThis.farmhand.state['purchasedCowPen'],
 *   huggingMachinesRemain?: boolean,
 * }} CowCardProps
 */

export const CowCard = (
  /**
   * @type CowCardProps
   */
  {
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
  }
) => {
  const cowDisplayName = getCowDisplayName(cow, id, allowCustomPeerCowNames)

  const [displayName, setDisplayName] = useState(cowDisplayName)
  const [cowImage, setCowImage] = useState(pixel)

  // @see https://github.com/microsoft/TypeScript/issues/27387#issuecomment-659671940
  const cardRef = useRef(/** @type {HTMLDivElement|null} */ (null))
  const scrollAnchorRef = useRef(/** @type {HTMLAnchorElement|null} */ (null))

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
      const cowImage = await getCowImage(cow)

      if (isMounted() === false) return

      setCowImage(cowImage)
    })()

    setDisplayName(getCowDisplayName(cow, id, allowCustomPeerCowNames))
  }, [cow, id, allowCustomPeerCowNames, isMounted])

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
                      disabled: id !== cow.originalOwnerId,
                      onChange: e => {
                        setDisplayName(e.target.value)
                        debounced?.handleCowNameInputChange({ ...e }, cow)
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
                    (PURCHASEABLE_COW_PENS.get(purchasedCowPen)?.cows ?? 0),
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
                      title: WITHDRAW_COW_FROM_TRADE('', cowDisplayName),
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
                  color: 'error',
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

/**
 * @param {Pick<CowCardProps, 'cow' | 'isCowOfferedForTradeByPeer' | 'isSelected'>} props
 */
export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <CowCard {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
