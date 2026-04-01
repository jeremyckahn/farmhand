import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tooltip from '@mui/material/Tooltip/index.js'
import Typography from '@mui/material/Typography/index.js'
import classNames from 'classnames'
import { array, bool, func, object, string } from 'prop-types'
import React, { Component } from 'react'
import { Tweenable } from 'shifty'

import { random } from '../../common/utils.ts'
import { LEFT, RIGHT } from '../../constants.ts'
import { pixel } from '../../img/index.ts'
import { getCowDisplayName, getCowImage } from '../../utils/index.tsx'

// Only moves the cow within the middle 80% of the pen
const randomPosition = () => 10 + random() * 80

export class Cow extends Component {
  state = {
    cowImage: pixel,
    isTransitioning: false,
    moveDirection: RIGHT,
    rotate: 0,
    showHugAnimation: false,
    x: randomPosition(),
    y: randomPosition(),
  }

  /** @type {null | NodeJS.Timeout} */
  repositionTimeoutId = null
  /** @type {null | NodeJS.Timeout} */
  animateHugTimeoutId = null
  tweenable = new Tweenable()
  isComponentMounted = false

  static flipAnimationDuration = 1000
  static transitionAnimationDuration = 3000

  // This MUST be kept in sync with $hug-animation-duration in CowPen.sass.
  static hugAnimationDuration = 750

  get waitVariance() {
    // @ts-expect-error
    return 2000 * this.props.cowInventory.length
  }

  componentDidUpdate(prevProps) {
    if (
      // @ts-expect-error
      this.props.isSelected &&
      !prevProps.isSelected &&
      this.repositionTimeoutId !== null
    ) {
      clearTimeout(this.repositionTimeoutId)
    }

    // @ts-expect-error
    if (!this.props.isSelected && prevProps.isSelected) {
      this.scheduleMove()
    }

    if (
      // @ts-expect-error
      this.props.cow.happinessBoostsToday >
        prevProps.cow.happinessBoostsToday &&
      !this.state.showHugAnimation
    ) {
      this.setState({ showHugAnimation: true })

      // @ts-expect-error
      this.animateHugTimeoutId = setTimeout(() => {
        if (this.isComponentMounted) {
          this.setState({ showHugAnimation: false })
        }
      }, Cow.hugAnimationDuration)
    }
  }

  move = async () => {
    const newX = randomPosition()

    const { moveDirection: oldDirection, x, y } = this.state
    const newDirection = newX < this.state.x ? LEFT : RIGHT

    if (this.isComponentMounted) {
      this.setState({
        moveDirection: newDirection,
      })
    }

    if (oldDirection !== newDirection) {
      /**
       * @param {{ rotate: number }} param0
       */
      const render = ({ rotate }) => {
        if (this.isComponentMounted) {
          this.setState({ rotate })
        }
      }

      try {
        const duration = Cow.flipAnimationDuration
        const easing = 'swingTo'

        if (newDirection === LEFT) {
          await this.tweenable.tween({
            from: {
              rotate: 0,
            },
            to: {
              rotate: 180,
            },
            easing,
            duration,
            // @ts-expect-error
            render,
          })
        } else {
          await this.tweenable.tween({
            from: {
              rotate: 180,
            },
            to: {
              rotate: 0,
            },
            easing,
            duration,
            // @ts-expect-error
            render,
          })
        }
      } catch (e) {
        // The tween was cancelled by the component unmounting
        return
      }
    }

    if (this.isComponentMounted) {
      this.setState({
        isTransitioning: true,
      })
    }

    try {
      await this.tweenable.tween({
        from: { x, y },
        to: { x: newX, y: randomPosition() },
        duration: Cow.transitionAnimationDuration,
        render: ({ x: newXValue, y: newYValue }) => {
          if (this.isComponentMounted) {
            this.setState({ x: newXValue, y: newYValue })
          }
        },
        easing: 'linear',
      })
    } catch (e) {
      // The tween was cancelled by the component unmounting
      return
    }

    if (this.isComponentMounted) {
      this.setState({ isTransitioning: false })
    }
    this.scheduleMove()
  }

  repositionTimeoutHandler = () => {
    this.repositionTimeoutId = null
    this.move()
  }

  scheduleMove = () => {
    // @ts-expect-error
    if (this.props.isSelected) {
      return
    }

    // @ts-expect-error
    this.repositionTimeoutId = setTimeout(
      this.repositionTimeoutHandler,
      random() * this.waitVariance
    )
  }

  componentDidMount() {
    this.isComponentMounted = true
    this.scheduleMove()
    ;(async () => {
      // @ts-expect-error
      const cowImage = await getCowImage(this.props.cow)

      if (!this.isComponentMounted) return

      this.setState({ cowImage: cowImage })
    })()
  }

  componentWillUnmount() {
    ;[this.repositionTimeoutId, this.animateHugTimeoutId].forEach(
      id => typeof id === 'number' && clearTimeout(id)
    )

    this.isComponentMounted = false
    this.tweenable.cancel()
  }

  render() {
    const {
      props: {
        // @ts-expect-error
        allowCustomPeerCowNames,
        // @ts-expect-error
        cow,
        // @ts-expect-error
        handleCowClick,
        // @ts-expect-error
        playerId,
        // @ts-expect-error
        isSelected,
      },
      state: { cowImage, isTransitioning, rotate, showHugAnimation, x, y },
    } = this

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
          {new Array((this.props as any).cow.happinessBoostsToday)
            .fill(undefined)
            .map((_, i) => (
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
}

// @ts-expect-error
Cow.propTypes = {
  allowCustomPeerCowNames: bool.isRequired,
  cow: object.isRequired,
  cowInventory: array.isRequired,
  handleCowClick: func.isRequired,
  playerId: string.isRequired,
  isSelected: bool.isRequired,
}
