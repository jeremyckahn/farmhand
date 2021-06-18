import React, { Component } from 'react'
import { array, bool, func, object, string } from 'prop-types'
import classNames from 'classnames'
import { Tweenable } from 'shifty'
import Tooltip from '@material-ui/core/Tooltip'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

import { cowColors } from '../../enums'
import { LEFT, RIGHT } from '../../constants'
import FarmhandContext from '../../Farmhand.context'
import { animals } from '../../img'

import './CowPen.sass'

export class Cow extends Component {
  state = {
    isMoving: false,
    moveDirection: RIGHT,
    showHugAnimation: false,
    x: Cow.randomPosition(),
    y: Cow.randomPosition(),
  }

  repositionTimeoutId = null
  animateMovementTimeoutId = null
  animateHugTimeoutId = null
  tweenable = new Tweenable()
  rotate = 0

  // This MUST be kept in sync with $movement-animation-duration in CowPen.sass.
  static movementAnimationDuration = 3000

  // This MUST be kept in sync with $hug-animation-duration in CowPen.sass.
  static hugAnimationDuration = 750

  static randomPosition = () => 10 + Math.random() * 80

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

  animateTimeoutHandler = () => {
    this.animateMovementTimeoutId = null
    this.finishMoving()
  }

  move = async () => {
    const newX = Cow.randomPosition()

    const { moveDirection: oldDirection } = this.state
    const newDirection = newX < this.state.x ? LEFT : RIGHT

    if (oldDirection !== newDirection) {
      const render = ({ rotate }) => {
        this.setState({ rotate })
      }

      try {
        const duration = 1000
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
      } catch (e) {}
    }

    this.animateMovementTimeoutId = setTimeout(
      this.animateTimeoutHandler,
      Cow.movementAnimationDuration
    )

    this.setState({
      isMoving: true,
      moveDirection: newDirection,
      x: newX,
      y: Cow.randomPosition(),
    })
  }

  finishMoving = () => {
    this.scheduleMove()
    this.setState({ isMoving: false })
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
      Math.random() * this.waitVariance
    )
  }

  componentDidMount() {
    this.scheduleMove()
  }

  componentWillUnmount() {
    ;[
      this.repositionTimeoutId,
      this.animateMovementTimeoutId,
      this.animateHugTimeoutId,
    ].forEach(clearTimeout)

    this.tweenable.cancel()
  }

  render() {
    const {
      props: { cow, handleCowClick, isSelected },
      state: { isMoving, rotate, showHugAnimation, x, y },
    } = this

    return (
      <div
        {...{
          className: classNames('cow', {
            'is-moving': isMoving,
            'is-selected': isSelected,
            faceLeft: this.state.moveDirection === LEFT,
            faceRight: this.state.moveDirection === RIGHT,
          }),
          onClick: () => handleCowClick(cow),
          style: {
            left: `${x}%`,
            top: `${y}%`,
          },
        }}
      >
        <Tooltip
          {...{
            arrow: true,
            placement: 'top',
            title: cow.name,
            open: isSelected,
            PopperProps: {
              disablePortal: true,
            },
          }}
        >
          <div {...{ style: { transform: `rotateY(${rotate}deg)` } }}>
            <img
              {...{
                src: animals.cow[cowColors[cow.color].toLowerCase()],
              }}
              alt="Cow"
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
  cow: object.isRequired,
  cowInventory: array.isRequired,
  handleCowClick: func.isRequired,
  isSelected: bool.isRequired,
}

export const CowPen = ({ cowInventory, handleCowClick, selectedCowId }) => (
  <div className="CowPen fill">
    {cowInventory.map(cow => (
      <Cow
        {...{
          cow,
          cowInventory,
          key: cow.id,
          handleCowClick,
          isSelected: selectedCowId === cow.id,
        }}
      />
    ))}
  </div>
)

CowPen.propTypes = {
  cowInventory: array.isRequired,
  handleCowClick: func.isRequired,
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
