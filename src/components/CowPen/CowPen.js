import React, { Component } from 'react';
import classNames from 'classnames';

import { cowColors } from '../../enums';
import FarmhandContext from '../../Farmhand.context';
import { animals } from '../../img';

import './CowPen.sass';

export class Cow extends Component {
  state = {
    isMoving: false,
    x: Cow.randomPosition(),
    y: Cow.randomPosition(),
  };

  repositionTimeoutHandler = 0;
  animateTimeoutHandler = 0;

  // This MUST be kept in sync with $animation-duration in CowPen.sass.
  static animationDuration = 3000;

  static waitVariance = 12 * 1000;

  static randomPosition = () => 10 + Math.random() * 80;

  move = () => {
    this.animateTimeoutHandler = setTimeout(
      this.finishMoving,
      Cow.animationDuration
    );

    this.setState({
      isMoving: true,
      x: Cow.randomPosition(),
      y: Cow.randomPosition(),
    });
  };

  finishMoving = () => {
    this.scheduleMove();
    this.setState({ isMoving: false });
  };

  scheduleMove = () => {
    this.repositionTimeoutHandler = setTimeout(
      this.move,
      Math.random() * Cow.waitVariance
    );
  };

  componentDidMount() {
    this.scheduleMove();
  }

  componentWillUnmount() {
    clearTimeout(this.repositionTimeoutHandler);
    clearTimeout(this.animateTimeoutHandler);
  }

  render() {
    const {
      props: { cow },
      state: { isMoving, x, y },
    } = this;

    return (
      <div
        {...{
          className: classNames('cow', { 'is-moving': isMoving }),
          style: {
            left: `${y}%`,
            top: `${x}%`,
          },
        }}
      >
        <img
          {...{
            src: animals.cow[cowColors[cow.color].toLowerCase()],
          }}
          alt="Cow"
        />
      </div>
    );
  }
}

export const CowPen = ({ cowInventory }) => (
  <div className="CowPen">
    {cowInventory.map((cow, i) => (
      <Cow {...{ cow, key: cow.id }} />
    ))}
  </div>
);

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <CowPen {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  );
}
