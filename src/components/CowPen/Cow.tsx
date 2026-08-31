import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tooltip from '@mui/material/Tooltip/index.js'
import Typography from '@mui/material/Typography/index.js'
import classNames from 'classnames'
import { useCallback, useEffect, useState } from 'react'
import { TweenState, Tweenable } from 'shifty'
import { useIsMounted } from 'usehooks-ts'

import { random } from '../../common/utils.js'
import { LEFT, RIGHT } from '../../constants.js'
import { pixel } from '../../img/index.js'
import { getCowDisplayName } from '../../utils/getCowDisplayName.js'
import { getCowImage } from '../../utils/getCowImage.js'

// Only moves the cow within the middle 80% of the pen
const randomPosition = () => 10 + random() * 80

const flipAnimationDuration = 1000
const transitionAnimationDuration = 3000

// This MUST be kept in sync with the `animationDuration` of the `.is-animating`
// rule in CowPen.tsx.
const hugAnimationDuration = 750

type CowPosition = { x: number; y: number }

type CowMoveDirection = typeof LEFT | typeof RIGHT

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
  const [moveDirection, setMoveDirection] = useState<CowMoveDirection>(RIGHT)
  const [rotate, setRotate] = useState(0)
  const [showHugAnimation, setShowHugAnimation] = useState(false)
  const [position, setPosition] = useState<CowPosition>(() => ({
    x: randomPosition(),
    y: randomPosition(),
  }))
  const [tweenable] = useState(() => new Tweenable())
  const [prevHappinessBoostsToday, setPrevHappinessBoostsToday] = useState(
    cow.happinessBoostsToday
  )
  const isMounted = useIsMounted()
  const { x, y } = position

  const move = useCallback(
    async (from: CowPosition, fromDirection: CowMoveDirection) => {
      const newX = randomPosition()
      const newY = randomPosition()
      const newDirection = newX < from.x ? LEFT : RIGHT

      setMoveDirection(newDirection)

      if (fromDirection !== newDirection) {
        const render = (tweenState: TweenState) => {
          if (typeof tweenState.rotate === 'number') {
            setRotate(tweenState.rotate)
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
        } catch {
          // The tween was cancelled by the component unmounting
          return
        }
      }

      setIsTransitioning(true)

      try {
        await tweenable.tween({
          from: { x: from.x, y: from.y },
          to: { x: newX, y: newY },
          duration: transitionAnimationDuration,
          render: ({ x: newXValue, y: newYValue }: any) => {
            setPosition({ x: newXValue, y: newYValue })
          },
          easing: 'linear',
        })
      } catch {
        // The tween was cancelled by the component unmounting
        return
      }

      setIsTransitioning(false)
      // The next move is scheduled by the movement effect below, which
      // re-runs when `isTransitioning` flips back to false.
    },
    [tweenable]
  )

  // Loads the cow's image on mount.
  useEffect(() => {
    ;(async () => {
      const loadedCowImage = await getCowImage(cow)

      if (isMounted() === false) return

      setCowImage(loadedCowImage)
    })()
    // Mount-only effect (the function-component equivalent of
    // `componentDidMount`): it must run exactly once, so `cow` is
    // intentionally omitted from the dependency array.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Cancels any in-flight tween on unmount; `move` handles the resulting
  // rejection in its `catch` blocks.
  useEffect(() => {
    return () => {
      tweenable.cancel()
    }
  }, [tweenable])

  // The cow walks whenever it is stationary and not selected. This effect
  // runs on mount, whenever `isSelected` changes, and whenever a move
  // completes (`isTransitioning` flipping back to false), and its cleanup
  // cancels the pending move whenever the cow gets selected or unmounted.
  // At most one move is ever in flight: a move can only start from the
  // timer this effect sets, and no timer is pending while a move is
  // in flight.
  useEffect(() => {
    if (isSelected || isTransitioning) {
      return
    }

    const waitVariance = 2000 * cowInventory.length

    const repositionTimeoutId = setTimeout(() => {
      void move(position, moveDirection)
    }, random() * waitVariance)

    return () => {
      clearTimeout(repositionTimeoutId)
    }
    // `position` and `moveDirection` are intentionally omitted: they only
    // ever change while a move is in flight, at which point this effect
    // early-returns and no timer is pending, so the closure values are
    // always current whenever a timer is actually set.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelected, isTransitioning, cowInventory.length, move])

  // Shows the hug animation whenever `happinessBoostsToday` increases. The
  // previous value is always synced to the current value (even when it
  // decreases, e.g. by the daily reset in `computeCowInventoryForNextDay`)
  // so that the first hug of a new day still animates, matching the
  // class-component behavior of comparing against the previous render's
  // props.
  useEffect(() => {
    const increased = cow.happinessBoostsToday > prevHappinessBoostsToday

    setPrevHappinessBoostsToday(cow.happinessBoostsToday)

    if (increased && !showHugAnimation) {
      setShowHugAnimation(true)
    }
  }, [cow.happinessBoostsToday, prevHappinessBoostsToday, showHugAnimation])

  useEffect(() => {
    if (!showHugAnimation) {
      return
    }

    const animateHugTimeoutId = setTimeout(() => {
      setShowHugAnimation(false)
    }, hugAnimationDuration)

    return () => {
      clearTimeout(animateHugTimeoutId)
    }
  }, [showHugAnimation])

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
