import React, { Component } from 'react';
import { array, bool, func, object, string } from 'prop-types';
import classNames from 'classnames';
import Tooltip from '@material-ui/core/Tooltip';

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

  repositionTimeoutId = null;
  animateTimeoutId = null;

  // This MUST be kept in sync with $animation-duration in CowPen.sass.
  static animationDuration = 3000;

  static waitVariance = 12 * 1000;

  static randomPosition = () => 10 + Math.random() * 80;

  componentDidUpdate(prevProps) {
    if (
      this.props.isSelected &&
      !prevProps.isSelected &&
      this.repositionTimeoutId !== null
    ) {
      clearTimeout(this.repositionTimeoutId);
    }

    if (!this.props.isSelected && prevProps.isSelected) {
      this.scheduleMove();
    }
  }

  animateTimeoutHandler = () => {
    this.animateTimeoutId = null;
    this.finishMoving();
  };

  move = () => {
    this.animateTimeoutId = setTimeout(
      this.animateTimeoutHandler,
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

  repositionTimeoutHandler = () => {
    this.repositionTimeoutId = null;
    this.move();
  };

  scheduleMove = () => {
    if (this.props.isSelected) {
      return;
    }

    this.repositionTimeoutId = setTimeout(
      this.repositionTimeoutHandler,
      Math.random() * Cow.waitVariance
    );
  };

  componentDidMount() {
    this.scheduleMove();
  }

  componentWillUnmount() {
    clearTimeout(this.repositionTimeoutId);
    clearTimeout(this.animateTimeoutId);
  }

  render() {
    const {
      props: { cow, handleCowSelect, isSelected },
      state: { isMoving, x, y },
    } = this;

    return (
      <div
        {...{
          className: classNames('cow', {
            'is-moving': isMoving,
            'is-selected': isSelected,
          }),
          onClick: () => handleCowSelect(cow),
          style: {
            left: `${y}%`,
            top: `${x}%`,
          },
        }}
      >
        <Tooltip
          {...{
            placement: 'top',
            title: cow.name,
            open: isSelected,
            PopperProps: {
              disablePortal: true,
            },
          }}
        >
          <img
            {...{
              src: animals.cow[cowColors[cow.color].toLowerCase()],
            }}
            alt="Cow"
          />
        </Tooltip>
      </div>
    );
  }
}

Cow.propTypes = {
  cow: object.isRequired,
  handleCowSelect: func.isRequired,
  isSelected: bool.isRequired,
};

export const CowPen = ({ cowInventory, handleCowSelect, selectedCowId }) => (
  <div className="CowPen">
    {cowInventory.map(cow => (
      <Cow
        {...{
          cow,
          key: cow.id,
          handleCowSelect,
          isSelected: selectedCowId === cow.id,
        }}
      />
    ))}
  </div>
);

CowPen.propTypes = {
  cowInventory: array.isRequired,
  handleCowSelect: func.isRequired,
  selectedCowId: string.isRequired,
};

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <CowPen {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  );
}
