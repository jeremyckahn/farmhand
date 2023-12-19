import React, { Component, useEffect } from 'react'
import { array, bool, func, object, string } from 'prop-types'
import classNames from 'classnames'
import { Tweenable } from 'shifty'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

import { LEFT, RIGHT } from '../../constants'
import FarmhandContext from '../Farmhand/Farmhand.context'
import { pixel } from '../../img'

import { getCowDisplayName, getCowImage } from '../../utils'

import './CowPen.sass'
import { random } from '../../common/utils'

// Only moves the cow within the middle 80% of the pen
const randomPosition = () => 10 + random() * 80

// TODO: Break this out into its own component file
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

  repositionTimeoutId = null
  animateHugTimeoutId = null
  tweenable = new Tweenable()
  isComponentMounted = false

  static flipAnimationDuration = 1000
  static transitionAnimationDuration = 3000

  // This MUST be kept in sync with $hug-animation-duration in CowPen.sass.
  static hugAnimationDuration = 750

  get waitVariance() {
    return 2000 * this.props.cowInventory.length
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.isSelected &&
      !prevProps.isSelected &&
      this.repositionTimeoutId !== null
    ) {
      clearTimeout(this.repositionTimeoutId)
    }

    if (!this.props.isSelected && prevProps.isSelected) {
      this.scheduleMove()
    }

    if (
      this.props.cow.happinessBoostsToday >
        prevProps.cow.happinessBoostsToday &&
      !this.state.showHugAnimation
    ) {
      this.setState({ showHugAnimation: true })

      this.animateHugTimeoutId = setTimeout(
        () => this.setState({ showHugAnimation: false }),
        Cow.hugAnimationDuration
      )
    }
  }

  move = async () => {
    const newX = randomPosition()

    const { moveDirection: oldDirection, x, y } = this.state
    const newDirection = newX < this.state.x ? LEFT : RIGHT

    this.setState({
      moveDirection: newDirection,
    })

    if (oldDirection !== newDirection) {
      const render = ({ rotate }) => {
        this.setState({ rotate })
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
            render,
          })
        }
      } catch (e) {
        // The tween was cancelled by the component unmounting
        return
      }
    }

    this.setState({
      isTransitioning: true,
    })

    try {
      await this.tweenable.tween({
        from: { x, y },
        to: { x: newX, y: randomPosition() },
        duration: Cow.transitionAnimationDuration,
        render: ({ x, y }) => {
          this.setState({ x, y })
        },
        easing: 'linear',
      })
    } catch (e) {
      // The tween was cancelled by the component unmounting
      return
    }

    this.setState({ isTransitioning: false })
    this.scheduleMove()
  }

  repositionTimeoutHandler = () => {
    this.repositionTimeoutId = null
    this.move()
  }

  scheduleMove = () => {
    if (this.props.isSelected) {
      return
    }

    this.repositionTimeoutId = setTimeout(
      this.repositionTimeoutHandler,
      random() * this.waitVariance
    )
  }

  componentDidMount() {
    this.isComponentMounted = true
    this.scheduleMove()
    ;(async () => {
      const cowImage = await getCowImage(this.props.cow)

      if (!this.isComponentMounted) return

      this.setState({ cowImage: cowImage })
    })()
  }

  componentWillUnmount() {
    ;[this.repositionTimeoutId, this.animateHugTimeoutId].forEach(clearTimeout)

    this.isComponentMounted = false
    this.tweenable.cancel()
  }

  render() {
    const {
      props: { allowCustomPeerCowNames, cow, handleCowClick, id, isSelected },
      state: { cowImage, isTransitioning, rotate, showHugAnimation, x, y },
    } = this

    const cowDisplayName = getCowDisplayName(cow, id, allowCustomPeerCowNames)

    return (
      <div
        {...{
          className: classNames('cow', {
            'is-transitioning': isTransitioning,
            'is-selected': isSelected,
            'is-loaded': cowImage !== pixel,
          }),
          onClick: () => handleCowClick(cow),
          style: {
            left: `${x}%`,
            top: `${y}%`,
          },
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
          {new Array(this.props.cow.happinessBoostsToday).fill().map((_, i) => (
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

Cow.propTypes = {
  allowCustomPeerCowNames: bool.isRequired,
  cow: object.isRequired,
  cowInventory: array.isRequired,
  handleCowClick: func.isRequired,
  id: string.isRequired,
  isSelected: bool.isRequired,
}

export const CowPen = ({
  allowCustomPeerCowNames,
  cowInventory,
  handleCowPenUnmount,
  handleCowClick,
  id,
  selectedCowId,
}) => {
  useEffect(() => {
    return () => {
      handleCowPenUnmount()
    }
  }, [handleCowPenUnmount])

  return (
    <div className="CowPen fill">
      {cowInventory.map(cow => (
        <Cow
          {...{
            allowCustomPeerCowNames,
            cow,
            cowInventory,
            key: cow.id,
            handleCowClick,
            id,
            isSelected: selectedCowId === cow.id,
          }}
        />
      ))}
    </div>
  )
}

CowPen.propTypes = {
  allowCustomPeerCowNames: bool.isRequired,
  cowInventory: array.isRequired,
  handleCowClick: func.isRequired,
  handleCowPenUnmount: func.isRequired,
  id: string.isRequired,
  selectedCowId: string.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <CowPen {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
