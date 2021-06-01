import React, { Component } from 'react'
import { array, bool, func, object, string } from 'prop-types'
import classNames from 'classnames'
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

  move = () => {
    const newX = Cow.randomPosition()

    this.animateMovementTimeoutId = setTimeout(
      this.animateTimeoutHandler,
      Cow.movementAnimationDuration
    )

    this.setState({
      isMoving: true,
      moveDirection: newX < this.state.x ? LEFT : RIGHT,
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
  }

  render() {
    const {
      props: { cow, handleCowClick, isSelected },
      state: { isMoving, showHugAnimation, x, y },
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
          <div>
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
