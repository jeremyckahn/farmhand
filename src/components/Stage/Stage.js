import React, { useEffect, useRef } from 'react'
import { Swipeable } from 'react-swipeable'
import classNames from 'classnames'
import { array, arrayOf, bool, func, string } from 'prop-types'
import Fab from '@material-ui/core/Fab'
import MenuIcon from '@material-ui/icons/Menu'

import FarmhandContext from '../../Farmhand.context'
import Field from '../Field'
import Home from '../Home'
import CowPen from '../CowPen'
import Shop from '../Shop'
import Kitchen from '../Kitchen'
import { stageFocusType } from '../../enums'

import './Stage.sass'

export const Stage = ({
  field,
  handleMenuButtonSwipe,
  handleMenuToggle,
  isMenuOpen,
  playerInventory,
  stageFocus,
  viewTitle,
}) => {
  const ref = useRef(null)

  useEffect(() => {
    const {
      current,
      current: { style },
    } = ref
    // Set scroll position to the top
    current.scrollTop = 0

    // Stop any intertial scrolling
    style.overflow = 'hidden'
    setTimeout(() => (style.overflow = ''), 0)
  }, [stageFocus])

  return (
    <div
      {...{
        className: classNames(
          'Stage',
          isMenuOpen ? 'menu-open' : 'menu-closed'
        ),
        ref,
      }}
    >
      <h2 className="view-title">{viewTitle}</h2>
      {stageFocus === stageFocusType.HOME && <Home />}
      {stageFocus === stageFocusType.FIELD && (
        <Field
          {...{
            columns: field[0].length,
            rows: field.length,
          }}
        />
      )}
      {stageFocus === stageFocusType.SHOP && <Shop />}
      {stageFocus === stageFocusType.COW_PEN && <CowPen />}
      {stageFocus === stageFocusType.KITCHEN && <Kitchen />}
      <div {...{ className: 'spacer' }} />
      <Swipeable
        {...{
          delta: 75,
          onSwiped: handleMenuButtonSwipe,
        }}
      >
        <Fab
          {...{
            className: classNames('menu-button', {
              'is-open': isMenuOpen,
            }),
            color: 'primary',
            'aria-label': 'Open drawer',
            onClick: () => handleMenuToggle(),
          }}
        >
          <MenuIcon />
        </Fab>
      </Swipeable>
    </div>
  )
}

Stage.propTypes = {
  field: arrayOf(array).isRequired,
  handleMenuButtonSwipe: func.isRequired,
  handleMenuToggle: func.isRequired,
  isMenuOpen: bool.isRequired,
  playerInventory: array.isRequired,
  stageFocus: string.isRequired,
  viewTitle: string.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Stage {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
