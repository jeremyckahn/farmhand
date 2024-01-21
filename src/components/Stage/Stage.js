import React, { useEffect, useRef } from 'react'
import classNames from 'classnames'
import { array, arrayOf, string } from 'prop-types'

import FarmhandContext from '../Farmhand/Farmhand.context'
import Field from '../Field'
import { Forest } from '../Forest'
import Home from '../Home'
import CowPen from '../CowPen'
import Shop from '../Shop'
import Workshop from '../Workshop'
import { Cellar } from '../Cellar'
import { stageFocusType } from '../../enums'
import { isOctober, isDecember } from '../../utils'

import './Stage.sass'

export const Stage = ({ field, stageFocus, viewTitle }) => {
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
        className: classNames('Stage', {
          'is-october': isOctober(),
          'is-december': isDecember(),
        }),
        'data-stage-focus': stageFocus,
        role: 'main',
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
      {stageFocus === stageFocusType.FOREST && <Forest />}
      {stageFocus === stageFocusType.SHOP && <Shop />}
      {stageFocus === stageFocusType.COW_PEN && <CowPen />}
      {stageFocus === stageFocusType.WORKSHOP && <Workshop />}
      {stageFocus === stageFocusType.CELLAR && <Cellar />}
      <div {...{ className: 'spacer' }} />
    </div>
  )
}

Stage.propTypes = {
  field: arrayOf(array).isRequired,
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
