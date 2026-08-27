import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tooltip from '@mui/material/Tooltip/index.js'
import Typography from '@mui/material/Typography/index.js'
import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { Tweenable } from 'shifty'

import { random } from '../../common/utils.js'
import { LEFT, RIGHT } from '../../constants.js'
import { pixel } from '../../img/index.js'
import { getCowDisplayName } from '../../utils/getCowDisplayName.js'
import { getCowImage } from '../../utils/getCowImage.js'

// Only moves the cow within the middle 80% of the pen
const randomPosition = () => 10 + random() * 80

const flipAnimationDuration = 1000
const transitionAnimationDuration = 3000

// This MUST be kept in sync with $hug-animation-duration in CowPen.sass.
const hugAnimationDuration = 750

export interface CowProps {
  allowCustomPeerCowNames: boolean
  cow: farmhand.cow
  cowInventory: farmhand.cow[]
  handleCowClick: (cow: farmhand.cow) => void
  playerId: string
  isSelected: boolean
}

export const Cow = ({
  allowCustomPeerCowNames,
  cow,
  cowInventory,
  handleCowClick,
  playerId,
  isSelected,
}: CowProps) => {
  const [cowImage, setCowImage] = useState(pixel)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [moveDirection, setMoveDirection] = useState(RIGHT)
  const [rotate, setRotate] = useState(0)
  const [showHugAnimation, setShowHugAnimation] = useState(false)
  const [position, setPosition] = useState(() => ({
    x: randomPosition(),
    y: randomPosition(),
  }))
  const { x, y } = position

  const isComponentMountedRef = useRef(false)
  const repositionTimeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  )
  const animateHugTimeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  )
  const tweenableRef = useRef<Tweenable | null>(null)
  const prevIsSelectedRef = useRef(isSelected)
  const prevHappinessBoostsTodayRef = useRef(cow.happinessBoostsToday)
  const cowInventoryRef = useRef(cowInventory)
  const isSelectedRef = useRef(isSelected)
  const positionRef = useRef(position)
  const moveDirectionRef = useRef(moveDirection)

  cowInventoryRef.current = cowInventory
  isSelectedRef.current = isSelected
  positionRef.current = position
  moveDirectionRef.current = moveDirection

  if (tweenableRef.current === null) {
    tweenableRef.current = new Tweenable()
  }

  const tweenable = tweenableRef.current

  const move = async () => {
    const newX = randomPosition()

    const oldDirection = moveDirectionRef.current
    const oldX = positionRef.current.x
    const oldY = positionRef.current.y
    const newDirection = newX < oldX ? LEFT : RIGHT

    if (isComponentMountedRef.current) {
      setMoveDirection(newDirection)
    }

    if (oldDirection !== newDirection) {
      const render = (tweenState: { rotate?: number | string }) => {
        if (isComponentMountedRef.current) {
          setRotate(tweenState.rotate as number)
        }
      }

      try {
        const duration = flipAnimationDuration
        const easing = 'swingTo'

        if (newDirection === LEFT) {
          await tweenable.tween({
            from: {
              rotate: 0,
            },
            to: {
              rotate: 180,
            },
            easing,
            duration,
            render,
          })
        } else {
          await tweenable.tween({
            from: {
              rotate: 180,
            },
            to: {
              rotate: 0,
            },
            easing,
            duration,
            render,
          })
        }
      } catch (e) {
        // The tween was cancelled by the component unmounting
        return
      }
    }

    if (isComponentMountedRef.current) {
      setIsTransitioning(true)
    }

    try {
      await tweenable.tween({
        from: { x: oldX, y: oldY },
        to: { x: newX, y: randomPosition() },
        duration: transitionAnimationDuration,
        render: ({ x: newXValue, y: newYValue }: any) => {
          if (isComponentMountedRef.current) {
            setPosition({ x: newXValue, y: newYValue })
          }
        },
        easing: 'linear',
      })
    } catch (e) {
      // The tween was cancelled by the component unmounting
      return
    }

    if (isComponentMountedRef.current) {
      setIsTransitioning(false)
    }

    scheduleMove()
  }

  const repositionTimeoutHandler = () => {
    repositionTimeoutIdRef.current = null

    move()
  }

  const scheduleMove = () => {
    if (isSelectedRef.current) {
      return
    }

    const waitVariance = 2000 * cowInventoryRef.current.length

    repositionTimeoutIdRef.current = setTimeout(
      repositionTimeoutHandler,
      random() * waitVariance
    )
  }

  useEffect(() => {
    if (
      isSelected &&
      !prevIsSelectedRef.current &&
      repositionTimeoutIdRef.current !== null
    ) {
      clearTimeout(repositionTimeoutIdRef.current)
    }

    if (!isSelected && prevIsSelectedRef.current) {
      scheduleMove()
    }

    prevIsSelectedRef.current = isSelected
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelected])

  useEffect(() => {
    if (
      cow.happinessBoostsToday > prevHappinessBoostsTodayRef.current &&
      !showHugAnimation
    ) {
      setShowHugAnimation(true)

      animateHugTimeoutIdRef.current = setTimeout(() => {
        if (isComponentMountedRef.current) {
          setShowHugAnimation(false)
        }
      }, hugAnimationDuration)
    }

    prevHappinessBoostsTodayRef.current = cow.happinessBoostsToday
  }, [cow.happinessBoostsToday, showHugAnimation])

  useEffect(() => {
    isComponentMountedRef.current = true

    scheduleMove()
    ;(async () => {
      const loadedCowImage = await getCowImage(cow)

      if (!isComponentMountedRef.current) return

      setCowImage(loadedCowImage)
    })()

    return () => {
      ;[repositionTimeoutIdRef.current, animateHugTimeoutIdRef.current].forEach(
        id => typeof id === 'number' && clearTimeout(id)
      )

      isComponentMountedRef.current = false

      tweenableRef.current?.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const cowDisplayName = getCowDisplayName(
    cow,
    playerId,
    allowCustomPeerCowNames
  )

  return (
    <div
      className={classNames('cow', {
        'is-transitioning': isTransitioning,
        'is-selected': isSelected,
        'is-loaded': cowImage !== pixel,
      })}
      onClick={() => handleCowClick(cow)}
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
    >
      {isSelected && (
        <p className="visually_hidden">{cowDisplayName} is selected</p>
      )}
      <Tooltip
        {...{
          arrow: true,
          placement: 'top',
          title: <Typography>{cowDisplayName}</Typography>,
          open: isSelected,
          PopperProps: {
            disablePortal: true,
          },
        }}
      >
        <div {...{ style: { transform: `rotateY(${rotate}deg)` } }}>
          <img
            {...{
              src: cowImage,
            }}
            alt={cowDisplayName}
          />
          <FontAwesomeIcon
            {...{
              className: classNames('animation', {
                'is-animating': showHugAnimation,
              }),
              icon: faHeart,
            }}
          />
        </div>
      </Tooltip>
      <ol {...{ className: 'happiness-boosts-today' }}>
        {new Array(cow.happinessBoostsToday).fill(undefined).map((_, i) => (
          <li {...{ key: i }}>
            <FontAwesomeIcon
              {...{
                icon: faHeart,
              }}
            />
          </li>
        ))}
      </ol>
    </div>
  )
}
