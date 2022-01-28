import React, { useEffect, useRef, useState } from 'react'
import { array, bool, func, number, object } from 'prop-types'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardHeader from '@material-ui/core/CardHeader'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons'

import { pixel } from '../../img'
import { genders } from '../../enums'
import {
  areHuggingMachinesInInventory,
  getCowImage,
  getCowValue,
  isInViewport,
} from '../../utils'
import { PURCHASEABLE_COW_PENS } from '../../constants'

import Subheader from './Subheader'

import './CowCard.sass'

const genderIcons = {
  [genders.FEMALE]: faVenus,
  [genders.MALE]: faMars,
}

const CowCard = ({
  cow,
  cowBreedingPen,
  cowInventory,
  debounced,
  handleCowAutomaticHugChange,
  handleCowBreedChange,
  handleCowHugClick,
  handleCowOfferClick,
  handleCowNameInputChange,
  handleCowPurchaseClick,
  handleCowSellClick,
  inventory,
  isSelected,
  isOnline,
  money,
  purchasedCowPen,

  isCowPurchased = !!handleCowSellClick,
  cowValue = getCowValue(cow, isCowPurchased),
  huggingMachinesRemain = areHuggingMachinesInInventory(inventory),
  isNameEditable = !!handleCowNameInputChange,
}) => {
  const [name, setName] = useState(cow.name)
  const [cowImage, setCowImage] = useState(pixel)
  const cardRef = useRef()
  const scrollAnchorRef = useRef()

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
                {isNameEditable ? (
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
              {isOnline && (
                <Tooltip
                  {...{
                    arrow: true,
                    placement: 'top',
                    title: `Offer ${cow.name} up to be traded with online players`,
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
              )}
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

export default CowCard

CowCard.propTypes = {
  cow: object.isRequired,
  cowBreedingPen: object.isRequired,
  cowInventory: array.isRequired,
  debounced: object,
  handleCowAutomaticHugChange: func,
  handleCowBreedChange: func,
  handleCowHugClick: func,
  handleCowOfferClick: func,
  handleCowNameInputChange: func,
  handleCowPurchaseClick: func,
  handleCowSellClick: func,
  inventory: array.isRequired,
  isOnline: bool.isRequired,
  isSelected: bool,
  money: number.isRequired,
  purchasedCowPen: number.isRequired,
}
