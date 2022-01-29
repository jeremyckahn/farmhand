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

import FarmhandContext from '../../Farmhand.context'

import { pixel } from '../../img'
import { genders } from '../../enums'
import {
  areHuggingMachinesInInventory,
  getCowImage,
  getCowValue,
  isCowInBreedingPen,
  isInViewport,
} from '../../utils'
import { PURCHASEABLE_COW_PENS } from '../../constants'
import { OFFER_COW_FOR_TRADE, RESCIND_COW_FROM_TRADE } from '../../templates'

import Subheader from './Subheader'

import './CowCard.sass'

const genderIcons = {
  [genders.FEMALE]: faVenus,
  [genders.MALE]: faMars,
}

export const CowCard = ({
  cow,
  cowBreedingPen,
  cowIdOfferedForTrade,
  cowInventory,
  debounced,
  handleCowAutomaticHugChange,
  handleCowBreedChange,
  handleCowHugClick,
  handleCowOfferClick,
  handleCowRescindClick,
  handleCowNameInputChange,
  handleCowPurchaseClick,
  handleCowSellClick,
  inventory,
  isSelected,
  isOnline,
  money,
  purchasedCowPen,

  huggingMachinesRemain = areHuggingMachinesInInventory(inventory),
}) => {
  const [name, setName] = useState(cow.name)
  const [cowImage, setCowImage] = useState(pixel)
  const cardRef = useRef()
  const scrollAnchorRef = useRef()

  const isCowPurchased = !!cowInventory.find(({ id }) => id === cow.id)
  const cowValue = getCowValue(cow, isCowPurchased)
  const cowCanBeTraded = isOnline && !isCowInBreedingPen(cow, cowBreedingPen)

  useEffect(() => {
    ;(async () => {
      setCowImage(await getCowImage(cow))
    })()
  }, [cow])

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
            {cow.name} is currently selected
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
                      onChange: e => {
                        if (debounced) {
                          setName(e.target.value)
                          debounced.handleCowNameInputChange({ ...e }, cow)
                        }
                      },
                      placeholder: 'Name',
                      value: name,
                    }}
                  />
                ) : (
                  cow.name
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
                  cow,
                  cowBreedingPen,
                  cowIdOfferedForTrade,
                  cowInventory,
                  cowValue,
                  handleCowBreedChange,
                  handleCowAutomaticHugChange,
                  huggingMachinesRemain,
                  isCowPurchased,
                }}
              />
            ),
          }}
        />
        <CardActions>
          {!isCowPurchased && (
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
              {cowCanBeTraded &&
                (cowIdOfferedForTrade === cow.id ? (
                  <Tooltip
                    {...{
                      arrow: true,
                      placement: 'top',
                      title: RESCIND_COW_FROM_TRADE`${cow}`,
                    }}
                  >
                    <Button
                      {...{
                        className: 'offer',
                        color: 'primary',
                        onClick: () => {
                          handleCowRescindClick && handleCowRescindClick(cow)
                        },
                        variant: 'contained',
                      }}
                    >
                      Rescind
                    </Button>
                  </Tooltip>
                ) : (
                  <Tooltip
                    {...{
                      arrow: true,
                      placement: 'top',
                      title: OFFER_COW_FOR_TRADE`${cow}`,
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
  cow: object.isRequired,
  cowBreedingPen: object.isRequired,
  cowIdOfferedForTrade: string.isRequired,
  cowInventory: array.isRequired,
  debounced: object,
  handleCowAutomaticHugChange: func,
  handleCowBreedChange: func,
  handleCowHugClick: func,
  handleCowOfferClick: func,
  handleCowRescindClick: func,
  handleCowNameInputChange: func,
  handleCowPurchaseClick: func,
  handleCowSellClick: func,
  inventory: array.isRequired,
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
